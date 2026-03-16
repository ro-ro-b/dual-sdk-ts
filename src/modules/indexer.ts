import type { HttpTransport } from '../transport.js';
import type { Template, DualObject, Face, Organization, PublicStats, PaginatedResponse } from '../types.js';

export class IndexerModule {
  constructor(private http: HttpTransport) {}

  async templates(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Template>> {
    return this.http.request('GET', '/public/templates', { query: params });
  }

  async getTemplate(templateId: string): Promise<Template> {
    return this.http.request('GET', `/public/templates/${templateId}`);
  }

  async getObject(objectId: string): Promise<DualObject> {
    return this.http.request('GET', `/public/objects/${objectId}`);
  }

  async searchObjects(query: Record<string, unknown>): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('POST', '/public/objects/search', { body: query });
  }

  async facesByTemplate(templateId: string): Promise<Face[]> {
    return this.http.request('GET', `/public/faces/template/${templateId}`);
  }

  async getOrganization(orgId: string): Promise<Organization> {
    return this.http.request('GET', `/public/organizations/${orgId}`);
  }

  async stats(): Promise<PublicStats> {
    return this.http.request('GET', '/public/stats');
  }
}
