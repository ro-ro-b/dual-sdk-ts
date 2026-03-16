import type { HttpTransport } from '../transport.js';
import type { Face, PaginatedResponse } from '../types.js';

export class FacesModule {
  constructor(private http: HttpTransport) {}

  async list(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Face>> {
    return this.http.request('GET', '/faces', { query: params });
  }

  async create(body: Record<string, unknown>): Promise<Face> {
    return this.http.request('POST', '/faces', { body });
  }

  async get(faceId: string): Promise<Face> {
    return this.http.request('GET', `/faces/${faceId}`);
  }

  async update(faceId: string, body: Partial<Face>): Promise<Face> {
    return this.http.request('PATCH', `/faces/${faceId}`, { body });
  }

  async delete(faceId: string): Promise<void> {
    await this.http.request('DELETE', `/faces/${faceId}`);
  }

  async byTemplate(templateId: string): Promise<Face[]> {
    return this.http.request('GET', `/faces/template/${templateId}`);
  }
}
