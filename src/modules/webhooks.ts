import type { HttpTransport } from '../transport.js';
import type { Webhook, PaginatedResponse } from '../types.js';

export class WebhooksModule {
  constructor(private http: HttpTransport) {}

  async list(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Webhook>> {
    return this.http.request('GET', '/webhooks', { query: params });
  }

  async create(body: { url: string; events: string[] } & Record<string, unknown>): Promise<Webhook> {
    return this.http.request('POST', '/webhooks', { body });
  }

  async get(webhookId: string): Promise<Webhook> {
    return this.http.request('GET', `/webhooks/${webhookId}`);
  }

  async update(webhookId: string, body: Partial<Webhook>): Promise<Webhook> {
    return this.http.request('PATCH', `/webhooks/${webhookId}`, { body });
  }

  async delete(webhookId: string): Promise<void> {
    await this.http.request('DELETE', `/webhooks/${webhookId}`);
  }

  async test(webhookId: string): Promise<unknown> {
    return this.http.request('POST', `/webhooks/${webhookId}/test`);
  }
}
