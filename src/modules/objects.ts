import type { HttpTransport } from '../transport.js';
import type {
  DualObject, PaginatedResponse, Action, PaginationParams,
  CreateObjectRequest, UpdateObjectRequest, SearchObjectsRequest,
} from '../types.js';

export class ObjectsModule {
  constructor(private http: HttpTransport) {}

  async list(params?: PaginationParams): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', '/objects', { query: params });
  }

  async get(objectId: string): Promise<DualObject> {
    return this.http.request('GET', `/objects/${objectId}`);
  }

  async create(body: CreateObjectRequest): Promise<DualObject> {
    return this.http.request('POST', '/objects', { body });
  }

  async update(objectId: string, body: UpdateObjectRequest): Promise<DualObject> {
    return this.http.request('PATCH', `/objects/${objectId}`, { body });
  }

  async children(objectId: string, params?: PaginationParams): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', `/objects/${objectId}/children`, { query: params });
  }

  async parents(objectId: string, params?: PaginationParams): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('GET', `/objects/${objectId}/parents`, { query: params });
  }

  async activity(objectId: string, params?: PaginationParams): Promise<PaginatedResponse<Action>> {
    return this.http.request('GET', `/objects/${objectId}/activity`, { query: params });
  }

  async search(query: SearchObjectsRequest): Promise<PaginatedResponse<DualObject>> {
    return this.http.request('POST', '/objects/search', { body: query });
  }

  async count(query: SearchObjectsRequest): Promise<{ count: number }> {
    return this.http.request('POST', '/objects/count', { body: query });
  }
}
