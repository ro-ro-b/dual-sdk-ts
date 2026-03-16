/**
 * Smoke / contract tests.
 *
 * These go beyond unit-level mocks: they verify packaging exports,
 * error class hierarchy at runtime, Retry-After parsing edge cases,
 * and that a packed tarball would expose the expected public surface.
 */

import { describe, it, expect } from 'vitest';

// Import from the public barrel — same path a consumer would use
import {
  DualClient,
  HttpTransport,
  DualError,
  DualAuthError,
  DualNotFoundError,
  DualRateLimitError,
  DualTimeoutError,
} from '../src/index.js';

// ── Public export surface ───────────────────────────────

describe('Public exports', () => {
  it('exports DualClient as a class', () => {
    expect(typeof DualClient).toBe('function');
    expect(new DualClient()).toBeInstanceOf(DualClient);
  });

  it('exports HttpTransport for advanced usage', () => {
    expect(typeof HttpTransport).toBe('function');
  });

  it('exports all error classes', () => {
    expect(typeof DualError).toBe('function');
    expect(typeof DualAuthError).toBe('function');
    expect(typeof DualNotFoundError).toBe('function');
    expect(typeof DualRateLimitError).toBe('function');
    expect(typeof DualTimeoutError).toBe('function');
  });
});

// ── Module surface ──────────────────────────────────────

describe('DualClient module surface', () => {
  const client = new DualClient();

  const expectedModules = [
    'wallets', 'templates', 'objects', 'organizations',
    'payments', 'storage', 'webhooks', 'notifications',
    'eventBus', 'faces', 'sequencer', 'indexer',
    'apiKeys', 'support',
  ] as const;

  it(`exposes all ${expectedModules.length} modules`, () => {
    for (const mod of expectedModules) {
      expect(client[mod], `Missing module: ${mod}`).toBeDefined();
      expect(typeof client[mod]).toBe('object');
    }
  });

  it('each module has methods (not empty objects)', () => {
    for (const mod of expectedModules) {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(client[mod]))
        .filter(m => m !== 'constructor');
      expect(methods.length, `Module ${mod} has no methods`).toBeGreaterThan(0);
    }
  });
});

// ── Error hierarchy contracts ───────────────────────────

describe('Error hierarchy runtime contracts', () => {
  it('all subclasses are instanceof DualError', () => {
    expect(new DualAuthError('X', {})).toBeInstanceOf(DualError);
    expect(new DualAuthError('X', {})).toBeInstanceOf(Error);
    expect(new DualNotFoundError('X', {})).toBeInstanceOf(DualError);
    expect(new DualRateLimitError('X', {}, '5')).toBeInstanceOf(DualError);
    expect(new DualTimeoutError(5000)).toBeInstanceOf(DualError);
  });

  it('error .name matches class name', () => {
    expect(new DualError(500, 'X', {}).name).toBe('DualError');
    expect(new DualAuthError('X', {}).name).toBe('DualAuthError');
    expect(new DualNotFoundError('X', {}).name).toBe('DualNotFoundError');
    expect(new DualRateLimitError('X', {}, null).name).toBe('DualRateLimitError');
    expect(new DualTimeoutError(1000).name).toBe('DualTimeoutError');
  });

  it('error .status reflects correct HTTP code', () => {
    expect(new DualAuthError('X', {}).status).toBe(401);
    expect(new DualNotFoundError('X', {}).status).toBe(404);
    expect(new DualRateLimitError('X', {}, null).status).toBe(429);
    expect(new DualTimeoutError(1000).status).toBe(0);
  });
});

// ── Retry-After parsing (RFC 7231 §7.1.3) ──────────────

describe('Retry-After parsing', () => {
  it('parses integer delay-seconds', () => {
    const err = new DualRateLimitError('X', {}, '120');
    expect(err.retryAfter).toBe(120);
  });

  it('parses float delay-seconds', () => {
    const err = new DualRateLimitError('X', {}, '1.5');
    expect(err.retryAfter).toBe(1.5);
  });

  it('parses HTTP-date format', () => {
    // Set a date 60 seconds in the future
    const futureDate = new Date(Date.now() + 60_000).toUTCString();
    const err = new DualRateLimitError('X', {}, futureDate);
    // Should be approximately 60 seconds (allow ±5 for test execution time)
    expect(err.retryAfter).toBeGreaterThanOrEqual(55);
    expect(err.retryAfter).toBeLessThanOrEqual(65);
  });

  it('returns 0 for HTTP-date in the past', () => {
    const pastDate = new Date(Date.now() - 60_000).toUTCString();
    const err = new DualRateLimitError('X', {}, pastDate);
    expect(err.retryAfter).toBe(0);
  });

  it('returns null for missing header', () => {
    const err = new DualRateLimitError('X', {}, null);
    expect(err.retryAfter).toBeNull();
  });

  it('returns null for undefined header', () => {
    const err = new DualRateLimitError('X', {});
    expect(err.retryAfter).toBeNull();
  });

  it('returns null for garbage value', () => {
    const err = new DualRateLimitError('X', {}, 'not-a-date-or-number');
    expect(err.retryAfter).toBeNull();
  });
});

// ── Config defaults ─────────────────────────────────────

describe('Config defaults', () => {
  it('client works with zero config', () => {
    const client = new DualClient();
    expect(client.getToken()).toBeUndefined();
  });

  it('setToken / getToken roundtrip', () => {
    const client = new DualClient();
    client.setToken('abc');
    expect(client.getToken()).toBe('abc');
  });
});
