import type { HttpTransport } from '../transport.js';
import type { SupportMessage, PaginatedResponse } from '../types.js';

export class SupportModule {
  constructor(private http: HttpTransport) {}

  async requestAccess(body: { feature: string; reason?: string }): Promise<unknown> {
    return this.http.request('POST', '/support/request-access', { body });
  }

  async listMessages(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<SupportMessage>> {
    return this.http.request('GET', '/support', { query: params });
  }

  async sendMessage(body: { content: string } & Record<string, unknown>): Promise<SupportMessage> {
    return this.http.request('POST', '/support', { body });
  }

  async getMessage(messageId: string): Promise<SupportMessage> {
    return this.http.request('GET', `/support/${messageId}`);
  }
}
