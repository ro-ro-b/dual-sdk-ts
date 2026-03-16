import type { HttpTransport } from '../transport.js';
import type {
  Template, Variation, PaginatedResponse, PaginationParams,
  CreateTemplateRequest, UpdateTemplateRequest, CreateVariationRequest,
} from '../types.js';

export class TemplatesModule {
  constructor(private http: HttpTransport) {}

  async list(params?: PaginationParams): Promise<PaginatedResponse<Template>> {
    return this.http.request('GET', '/templates', { query: params });
  }

  async create(body: CreateTemplateRequest): Promise<Template> {
    return this.http.request('POST', '/templates', { body });
  }

  async get(templateId: string): Promise<Template> {
    return this.http.request('GET', `/templates/${templateId}`);
  }

  async update(templateId: string, body: UpdateTemplateRequest): Promise<Template> {
    return this.http.request('PATCH', `/templates/${templateId}`, { body });
  }

  async delete(templateId: string): Promise<void> {
    await this.http.request('DELETE', `/templates/${templateId}`);
  }

  async listVariations(templateId: string, params?: PaginationParams): Promise<PaginatedResponse<Variation>> {
    return this.http.request('GET', `/templates/${templateId}/variations`, { query: params });
  }

  async createVariation(templateId: string, body: CreateVariationRequest): Promise<Variation> {
    return this.http.request('POST', `/templates/${templateId}/variations`, { body });
  }
}
