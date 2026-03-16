import type { HttpTransport } from '../transport.js';
import type { DualObject, PaginatedResponse, Action } from '../types.js';

export class ObjectsModule {
  constructor(private http: HttpTransport) {}

  async list(params?: { limit?: number; next?: string } & Record<string, unknown>): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', '/objects', { query: params });
  }

  async get(objectId: string): Promise<DualObject> {
    return this.http.request('GET', `/objects/${objectId}`);
  }

  async create(body: { template_id: string; properties?: Record<string, unknown> } & Record<string, unknown>): Promise<DualObject> {
    return this.http.request('POST', '/objects', { body });
  }

  async update(objectId: string, body: Partial<DualObject>): Promise<DualObject> {
    return this.http.request('PATCH', `/objects/${objectId}`, { body });
  }

  async children(objectId: string, params?: { limit?: number; next?: string }): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', `/objects/${objectId}/children`, { query: params });
  }

  async parents(objectId: string, params?: { limit?: number; next?: string }): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', `/objects/${objectId}/parents`, { query: params });
  }

  async activity(objectId: string, params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Action>> {
    return this.http.request('GET', `/objects/${objectId}/activity`, { query: params });
  }

  async search(query: Record<string, unknown>): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('POST', '/objects/search', { body: query });
  }

  async count(query: Record<string, unknown>): Promise<{ count: number }> {
    return this.http.request('POST', '/objects/count', { body: query });
  }
}
