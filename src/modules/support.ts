import type { HttpTransport } from '../transport.js';
import type {
  SupportMessage, PaginatedResponse, PaginationParams,
  SendSupportMessageRequest, RequestAccessRequest,
} from '../types.js';

export class SupportModule {
  constructor(private http: HttpTransport) {}

  async requestAccess(body: RequestAccessRequest): Promise<unknown> {
    return this.http.request('POST', '/support/request-access', { body });
  }

  async listMessages(params?: PaginationParams): Promise<PaginatedResponse<SupportMessage>> {
    return this.http.request('GET', '/support', { query: params });
  }

  async sendMessage(body: SendSupportMessageRequest): Promise<SupportMessage> {
    return this.http.request('POST', '/support', { body });
  }

  async getMessage(messageId: string): Promise<SupportMessage> {
    return this.http.request('GET', `/support/${messageId}`);
  }
}
