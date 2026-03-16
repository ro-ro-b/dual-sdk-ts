import type { HttpTransport } from '../transport.js';
import type { Message, MessageTemplate, PaginatedResponse } from '../types.js';

export class NotificationsModule {
  constructor(private http: HttpTransport) {}

  async listMessages(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Message>> {
    return this.http.request('GET', '/messages', { query: params });
  }

  async send(body: { content: string } & Record<string, unknown>): Promise<Message> {
    return this.http.request('POST', '/messages/send', { body });
  }

  async listTemplates(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<MessageTemplate>> {
    return this.http.request('GET', '/messages/templates', { query: params });
  }

  async getTemplate(templateId: string): Promise<MessageTemplate> {
    return this.http.request('GET', `/messages/templates/${templateId}`);
  }

  async createTemplate(body: { name: string; body: string } & Record<string, unknown>): Promise<MessageTemplate> {
    return this.http.request('POST', '/messages/templates', { body });
  }

  async updateTemplate(templateId: string, body: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.http.request('PATCH', `/messages/templates/${templateId}`, { body });
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.http.request('DELETE', `/messages/templates/${templateId}`);
  }
}
