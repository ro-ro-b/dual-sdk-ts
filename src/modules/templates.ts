import type { HttpTransport } from '../transport.js';
import type { Template, Variation, PaginatedResponse } from '../types.js';

export class TemplatesModule {
  constructor(private http: HttpTransport) {}

  async list(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Template>> {
    return this.http.request('GET', '/templates', { query: params });
  }

  async create(body: { name: string } & Record<string, unknown>): Promise<Template> {
    return this.http.request('POST', '/templates', { body });
  }

  async get(templateId: string): Promise<Template> {
    return this.http.request('GET', `/templates/${templateId}`);
  }

  async update(templateId: string, body: Partial<Template>): Promise<Template> {
    return this.http.request('PATCH', `/templates/${templateId}`, { body });
  }

  async delete(templateId: string): Promise<void> {
    await this.http.request('DELETE', `/templates/${templateId}`);
  }

  async listVariations(templateId: string, params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Variation>> {
    return this.http.request('GET', `/templates/${templateId}/variations`, { query: params });
  }

  async createVariation(templateId: string, body: { name: string } & Record<string, unknown>): Promise<Variation> {
    return this.http.request('POST', `/templates/${templateId}/variations`, { body });
  }
}
