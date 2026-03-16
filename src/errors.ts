/**
 * DUAL SDK error hierarchy.
 *
 * DualError
 *   ├── DualAuthError      (401)
 *   ├── DualNotFoundError   (404)
 *   ├── DualRateLimitError  (429)
 *   └── DualTimeoutError    (aborted/timeout)
 */

export class DualError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly body: unknown,
    message?: string
  ) {
    super(message ?? `${code} (${status})`);
    this.name = 'DualError';
  }
}

export class DualAuthError extends DualError {
  constructor(code: string, body: unknown) {
    super(401, code, body, `Authentication failed: ${code}`);
    this.name = 'DualAuthError';
  }
}

export class DualNotFoundError extends DualError {
  constructor(code: string, body: unknown) {
    super(404, code, body, `Not found: ${code}`);
    this.name = 'DualNotFoundError';
  }
}

export class DualRateLimitError extends DualError {
  /** Retry delay in seconds, parsed from the Retry-After header (supports both delay-seconds and HTTP-date). */
  public readonly retryAfter: number | null;

  constructor(code: string, body: unknown, retryAfter?: string | null) {
    super(429, code, body, `Rate limited: ${code}`);
    this.name = 'DualRateLimitError';
    this.retryAfter = retryAfter ? parseRetryAfter(retryAfter) : null;
  }
}

/**
 * Parse Retry-After header value.
 * RFC 7231 §7.1.3: can be either delay-seconds (integer) or HTTP-date.
 */
function parseRetryAfter(value: string): number | null {
  const seconds = Number(value);
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return seconds;
  }
  // Try HTTP-date (e.g. "Fri, 31 Dec 2025 23:59:59 GMT")
  const date = Date.parse(value);
  if (!Number.isNaN(date)) {
    const delta = Math.max(0, Math.ceil((date - Date.now()) / 1000));
    return delta;
  }
  return null;
}

export class DualTimeoutError extends DualError {
  constructor(timeoutMs: number) {
    super(0, 'TIMEOUT', { timeoutMs }, `Request timed out after ${timeoutMs}ms`);
    this.name = 'DualTimeoutError';
  }
}
