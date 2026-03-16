import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DualClient } from '../src/client.js';
import {
  DualError,
  DualAuthError,
  DualNotFoundError,
  DualRateLimitError,
  DualTimeoutError,
} from '../src/errors.js';
import type { DualConfig } from '../src/types.js';

// ── Helpers ──────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function createClient(responses: Response | Response[], config: Partial<DualConfig> = {}) {
  const queue = Array.isArray(responses) ? [...responses] : [responses];
  const fetchMock = vi.fn(async () => {
    const res = queue.shift();
    if (!res) throw new Error('No more mock responses');
    return res;
  });

  const client = new DualClient({
    token: 'test-token',
    baseUrl: 'https://test.local',
    retry: { maxAttempts: 0 },
    fetch: fetchMock as unknown as typeof globalThis.fetch,
    ...config,
  });

  return { client, fetchMock };
}

// ── Client construction ─────────────────────────────────

describe('DualClient', () => {
  it('exposes all 14 resource modules', () => {
    const { client } = createClient(jsonResponse({}));
    expect(client.wallets).toBeDefined();
    expect(client.templates).toBeDefined();
    expect(client.objects).toBeDefined();
    expect(client.organizations).toBeDefined();
    expect(client.payments).toBeDefined();
    expect(client.storage).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.notifications).toBeDefined();
    expect(client.eventBus).toBeDefined();
    expect(client.faces).toBeDefined();
    expect(client.sequencer).toBeDefined();
    expect(client.indexer).toBeDefined();
    expect(client.apiKeys).toBeDefined();
    expect(client.support).toBeDefined();
  });

  it('setToken / getToken roundtrips', () => {
    const { client } = createClient(jsonResponse({}));
    expect(client.getToken()).toBe('test-token');
    client.setToken('new-token');
    expect(client.getToken()).toBe('new-token');
  });
});

// ── Auth modes ──────────────────────────────────────────

describe('Auth modes', () => {
  it('sends Bearer header by default', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ id: 'w1', email: 'a@b.com' })
    );
    await client.wallets.me();
    const headers = fetchMock.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-token');
    expect(headers['x-api-key']).toBeUndefined();
  });

  it('sends x-api-key header in api_key mode', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ id: 'w1' }),
      { authMode: 'api_key' }
    );
    await client.wallets.me();
    const headers = fetchMock.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('test-token');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('sends both headers in both mode', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ id: 'w1' }),
      { authMode: 'both' }
    );
    await client.wallets.me();
    const headers = fetchMock.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('test-token');
    expect(headers['Authorization']).toBe('Bearer test-token');
  });
});

// ── Typed responses ─────────────────────────────────────

describe('Typed responses', () => {
  it('wallets.me() returns Wallet', async () => {
    const { client } = createClient(
      jsonResponse({ id: 'w1', email: 'dev@dual.io', name: 'Dev' })
    );
    const wallet = await client.wallets.me();
    expect(wallet.id).toBe('w1');
    expect(wallet.email).toBe('dev@dual.io');
  });

  it('templates.list() returns PaginatedResponse<Template>', async () => {
    const { client } = createClient(
      jsonResponse({ items: [{ id: 't1', name: 'Gold' }], next: null })
    );
    const page = await client.templates.list();
    expect(page.items).toHaveLength(1);
    expect(page.items[0]!.id).toBe('t1');
    expect(page.next).toBeNull();
  });

  it('objects.create() returns DualObject', async () => {
    const { client } = createClient(
      jsonResponse({ id: 'obj1', template_id: 't1', properties: { rarity: 'epic' } })
    );
    const obj = await client.objects.create({ template_id: 't1', properties: { rarity: 'epic' } });
    expect(obj.id).toBe('obj1');
    expect(obj.template_id).toBe('t1');
  });

  it('organizations.members() returns PaginatedResponse<Member>', async () => {
    const { client } = createClient(
      jsonResponse({ items: [{ id: 'm1', wallet_id: 'w1', role: 'admin' }], next: null })
    );
    const page = await client.organizations.listMembers('org1');
    expect(page.items[0]!.wallet_id).toBe('w1');
  });

  it('webhooks.list() returns PaginatedResponse<Webhook>', async () => {
    const { client } = createClient(
      jsonResponse({ items: [{ id: 'wh1', url: 'https://cb.io', events: ['mint'] }], next: null })
    );
    const page = await client.webhooks.list();
    expect(page.items[0]!.events).toContain('mint');
  });

  it('apiKeys.list() returns ApiKey[]', async () => {
    const { client } = createClient(
      jsonResponse([{ id: 'k1', name: 'prod' }])
    );
    const keys = await client.apiKeys.list();
    expect(keys).toHaveLength(1);
    expect(keys[0]!.name).toBe('prod');
  });

  it('indexer.stats() returns PublicStats', async () => {
    const { client } = createClient(
      jsonResponse({ total_templates: 42, total_objects: 1000 })
    );
    const stats = await client.indexer.stats();
    expect(stats.total_templates).toBe(42);
  });

  it('sequencer.getBatch() returns Batch', async () => {
    const { client } = createClient(
      jsonResponse({ id: 'b1', status: 'completed', action_count: 50 })
    );
    const batch = await client.sequencer.getBatch('b1');
    expect(batch.status).toBe('completed');
  });
});

// ── Error hierarchy ─────────────────────────────────────

describe('Error hierarchy', () => {
  it('throws DualAuthError on 401', async () => {
    const { client } = createClient(
      jsonResponse({ code: 'UNAUTHORIZED', message: 'Bad token' }, 401)
    );
    await expect(client.wallets.me()).rejects.toThrow(DualAuthError);
  });

  it('throws DualNotFoundError on 404', async () => {
    const { client } = createClient(
      jsonResponse({ code: 'NOT_FOUND' }, 404)
    );
    await expect(client.objects.get('nope')).rejects.toThrow(DualNotFoundError);
  });

  it('throws DualRateLimitError on 429 with retryAfter', async () => {
    const { client } = createClient(
      jsonResponse({ code: 'RATE_LIMITED' }, 429, { 'retry-after': '30' })
    );
    try {
      await client.wallets.me();
      expect.unreachable('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(DualRateLimitError);
      expect((err as DualRateLimitError).retryAfter).toBe(30);
    }
  });

  it('throws DualError on other status codes', async () => {
    const { client } = createClient(
      jsonResponse({ code: 'SERVER_ERROR' }, 500)
    );
    await expect(client.wallets.me()).rejects.toThrow(DualError);
  });

  it('all errors extend DualError', () => {
    expect(new DualAuthError('X', {})).toBeInstanceOf(DualError);
    expect(new DualNotFoundError('X', {})).toBeInstanceOf(DualError);
    expect(new DualRateLimitError('X', {}, '5')).toBeInstanceOf(DualError);
    expect(new DualTimeoutError(5000)).toBeInstanceOf(DualError);
  });
});

// ── Retry behavior ──────────────────────────────────────

describe('Retry behavior', () => {
  it('retries on 429 then succeeds', async () => {
    const responses = [
      jsonResponse({ code: 'RATE_LIMITED' }, 429),
      jsonResponse({ id: 'w1', email: 'ok@ok.com' }),
    ];

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(responses[0])
      .mockResolvedValueOnce(responses[1]);

    const client = new DualClient({
      token: 'test',
      baseUrl: 'https://test.local',
      retry: { maxAttempts: 2, backoffMs: 1 },
      fetch: fetchMock as unknown as typeof globalThis.fetch,
    });

    const wallet = await client.wallets.me();
    expect(wallet.id).toBe('w1');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries on 500 then succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ code: 'ERROR' }, 500))
      .mockResolvedValueOnce(jsonResponse({ items: [], next: null }));

    const client = new DualClient({
      token: 'test',
      baseUrl: 'https://test.local',
      retry: { maxAttempts: 2, backoffMs: 1 },
      fetch: fetchMock as unknown as typeof globalThis.fetch,
    });

    const result = await client.templates.list();
    expect(result.items).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry on 400', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ code: 'BAD_REQUEST' }, 400));

    const client = new DualClient({
      token: 'test',
      baseUrl: 'https://test.local',
      retry: { maxAttempts: 3, backoffMs: 1 },
      fetch: fetchMock as unknown as typeof globalThis.fetch,
    });

    await expect(client.wallets.me()).rejects.toThrow(DualError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry on 401', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ code: 'UNAUTHORIZED' }, 401));

    const client = new DualClient({
      token: 'test',
      baseUrl: 'https://test.local',
      retry: { maxAttempts: 3, backoffMs: 1 },
      fetch: fetchMock as unknown as typeof globalThis.fetch,
    });

    await expect(client.wallets.me()).rejects.toThrow(DualAuthError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

// ── Query params ────────────────────────────────────────

describe('Query params', () => {
  it('appends query params to URL', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ items: [], next: null })
    );
    await client.templates.list({ limit: 5, next: 'cursor123' });
    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toContain('limit=5');
    expect(url).toContain('next=cursor123');
  });

  it('omits undefined query params', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ items: [], next: null })
    );
    await client.templates.list({ limit: 10 });
    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toContain('limit=10');
    expect(url).not.toContain('next');
  });
});

// ── Request body ────────────────────────────────────────

describe('Request body', () => {
  it('sends JSON body for POST', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ access_token: 'abc', refresh_token: null })
    );
    await client.wallets.login('a@b.com', 'pass');
    const init = fetchMock.mock.calls[0]![1]!;
    expect(init.headers).toHaveProperty('Content-Type', 'application/json');
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.com', password: 'pass' });
  });

  it('does NOT set Content-Type for FormData', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ id: 'f1', url: 'https://cdn/f1' })
    );
    const fd = new FormData();
    fd.append('file', new Blob(['hello']), 'test.txt');
    await client.storage.upload(fd);
    const headers = fetchMock.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(headers['Content-Type']).toBeUndefined();
  });
});

// ── URL construction ────────────────────────────────────

describe('URL construction', () => {
  it('constructs correct URLs with path params', async () => {
    const { client, fetchMock } = createClient(
      jsonResponse({ id: 'obj1', template_id: 't1' })
    );
    await client.objects.get('my-object-id');
    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toBe('https://test.local/objects/my-object-id');
  });

  it('strips trailing slashes from base URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 'w1' }));
    const client = new DualClient({
      token: 'test',
      baseUrl: 'https://test.local///',
      retry: { maxAttempts: 0 },
      fetch: fetchMock as unknown as typeof globalThis.fetch,
    });
    await client.wallets.me();
    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toBe('https://test.local/wallets/me');
  });
});

// ── Forward compatibility ───────────────────────────────

describe('Forward compatibility', () => {
  it('preserves unknown fields in API responses', async () => {
    const { client } = createClient(
      jsonResponse({ id: 'w1', email: 'a@b.com', new_field: 'future' })
    );
    const wallet = await client.wallets.me();
    expect(wallet.id).toBe('w1');
    // Extra fields come through because we use plain objects with index signature
    expect((wallet as Record<string, unknown>)['new_field']).toBe('future');
  });
});
