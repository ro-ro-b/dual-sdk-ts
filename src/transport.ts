/**
 * HTTP transport layer.
 *
 * Fixes vs v1:
 * - Supports both API key (x-api-key) and Bearer auth
 * - Does NOT set Content-Type globally — lets fetch/FormData handle it
 * - Only retries on 429 and 5xx (not all errors)
 * - Richer error types: DualAuthError, DualNotFoundError, DualRateLimitError, DualTimeoutError
 * - Supports FormData for file uploads
 */

import type { AuthMode, DualConfig } from './types.js';
import {
  DualError,
  DualAuthError,
  DualNotFoundError,
  DualRateLimitError,
  DualTimeoutError,
} from './errors.js';

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

export class HttpTransport {
  private baseUrl: string;
  private token?: string;
  private authMode: AuthMode;
  private timeout: number;
  private fetchImpl: typeof globalThis.fetch;
  private maxRetries: number;
  private backoffMs: number;

  constructor(config: DualConfig = {}) {
    this.baseUrl = (config.baseUrl || 'https://blockv-labs.io').replace(/\/+$/, '');
    this.token = config.token;
    this.authMode = config.authMode || 'bearer';
    this.timeout = config.timeout || 30_000;
    this.fetchImpl = config.fetch || globalThis.fetch;
    this.maxRetries = config.retry?.maxAttempts ?? 3;
    this.backoffMs = config.retry?.backoffMs ?? 1000;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | undefined {
    return this.token;
  }

  async request<T = unknown>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      formData?: FormData;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    let url = this.baseUrl + path;

    if (options?.query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined && v !== null) {
          params.append(k, String(v));
        }
      }
      const qs = params.toString();
      if (qs) url += '?' + qs;
    }

    const headers: Record<string, string> = { ...options?.headers };

    // Auth headers
    if (this.token) {
      if (this.authMode === 'api_key' || this.authMode === 'both') {
        headers['x-api-key'] = this.token;
      }
      if (this.authMode === 'bearer' || this.authMode === 'both') {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
    }

    // Body handling — only set Content-Type for JSON, let FormData set its own
    let fetchBody: BodyInit | undefined;
    if (options?.formData) {
      fetchBody = options.formData;
      // Do NOT set Content-Type — browser/node will set multipart boundary
    } else if (options?.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(options.body);
    }

    let lastError: DualError | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = this.backoffMs * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, delay));
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        let response: Response;
        try {
          response = await this.fetchImpl(url, {
            method,
            headers,
            body: fetchBody,
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }

        // Parse response
        const ct = response.headers.get('content-type');
        const isJson = ct?.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (response.ok) {
          return data as T;
        }

        // Build typed error
        const code = (typeof data === 'object' && data && 'code' in data)
          ? (data as Record<string, unknown>).code as string
          : 'ERROR';

        const error = this.buildError(response.status, code, data, response.headers);

        // Only retry on retryable statuses
        if (RETRYABLE_STATUSES.has(response.status) && attempt < this.maxRetries) {
          lastError = error;
          continue;
        }

        throw error;
      } catch (err) {
        if (err instanceof DualError) {
          lastError = err;
          if (!RETRYABLE_STATUSES.has(err.status) || attempt >= this.maxRetries) {
            throw err;
          }
          continue;
        }

        // Abort/timeout
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new DualTimeoutError(this.timeout);
        }

        // Network error — don't retry
        throw new DualError(0, 'NETWORK_ERROR', { message: (err as Error).message });
      }
    }

    throw lastError ?? new DualError(0, 'REQUEST_FAILED', { message: 'Max retries exceeded' });
  }

  private buildError(
    status: number,
    code: string,
    body: unknown,
    headers: Headers
  ): DualError {
    switch (status) {
      case 401:
        return new DualAuthError(code, body);
      case 404:
        return new DualNotFoundError(code, body);
      case 429:
        return new DualRateLimitError(code, body, headers.get('retry-after'));
      default:
        return new DualError(status, code, body);
    }
  }
}
