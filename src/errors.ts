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
  public readonly retryAfter: number | null;

  constructor(code: string, body: unknown, retryAfter?: string | null) {
    super(429, code, body, `Rate limited: ${code}`);
    this.name = 'DualRateLimitError';
    this.retryAfter = retryAfter ? parseFloat(retryAfter) : null;
  }
}

export class DualTimeoutError extends DualError {
  constructor(timeoutMs: number) {
    super(0, 'TIMEOUT', { timeoutMs }, `Request timed out after ${timeoutMs}ms`);
    this.name = 'DualTimeoutError';
  }
}
