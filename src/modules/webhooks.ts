import type { HttpTransport } from '../transport.js';
import type {
  Webhook, PaginatedResponse, PaginationParams,
  CreateWebhookRequest, UpdateWebhookRequest,
} from '../types.js';

export class WebhooksModule {
  constructor(private http: HttpTransport) {}

  async list(params?: PaginationParams): Promise<PaginatedResponse<Webhook>> {
    return this.http.request('GET', '/webhooks', { query: params });
  }

  async create(body: CreateWebhookRequest): Promise<Webhook> {
    return this.http.request('POST', '/webhooks', { body });
  }

  async get(webhookId: string): Promise<Webhook> {
    return this.http.request('GET', `/webhooks/${webhookId}`);
  }

  async update(webhookId: string, body: UpdateWebhookRequest): Promise<Webhook> {
    return this.http.request('PATCH', `/webhooks/${webhookId}`, { body });
  }

  async delete(webhookId: string): Promise<void> {
    await this.http.request('DELETE', `/webhooks/${webhookId}`);
  }

  async test(webhookId: string): Promise<unknown> {
    return this.http.request('POST', `/webhooks/${webhookId}/test`);
  }
}
