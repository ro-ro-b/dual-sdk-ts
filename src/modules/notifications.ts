import type { HttpTransport } from '../transport.js';
import type {
  Message, MessageTemplate, PaginatedResponse, PaginationParams,
  SendMessageRequest, CreateMessageTemplateRequest,
} from '../types.js';

export class NotificationsModule {
  constructor(private http: HttpTransport) {}

  async listMessages(params?: PaginationParams): Promise<PaginatedResponse<Message>> {
    return this.http.request('GET', '/messages', { query: params });
  }

  async send(body: SendMessageRequest): Promise<Message> {
    return this.http.request('POST', '/messages/send', { body });
  }

  async listTemplates(params?: PaginationParams): Promise<PaginatedResponse<MessageTemplate>> {
    return this.http.request('GET', '/messages/templates', { query: params });
  }

  async getTemplate(templateId: string): Promise<MessageTemplate> {
    return this.http.request('GET', `/messages/templates/${templateId}`);
  }

  async createTemplate(body: CreateMessageTemplateRequest): Promise<MessageTemplate> {
    return this.http.request('POST', '/messages/templates', { body });
  }

  async updateTemplate(templateId: string, body: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.http.request('PATCH', `/messages/templates/${templateId}`, { body });
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.http.request('DELETE', `/messages/templates/${templateId}`);
  }
}
