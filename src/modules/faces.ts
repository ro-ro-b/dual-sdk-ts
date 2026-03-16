import type { HttpTransport } from '../transport.js';
import type {
  Face, PaginatedResponse, PaginationParams,
  CreateFaceRequest, UpdateFaceRequest,
} from '../types.js';

export class FacesModule {
  constructor(private http: HttpTransport) {}

  async list(params?: PaginationParams): Promise<PaginatedResponse<Face>> {
    return this.http.request('GET', '/faces', { query: params });
  }

  async create(body: CreateFaceRequest): Promise<Face> {
    return this.http.request('POST', '/faces', { body });
  }

  async get(faceId: string): Promise<Face> {
    return this.http.request('GET', `/faces/${faceId}`);
  }

  async update(faceId: string, body: UpdateFaceRequest): Promise<Face> {
    return this.http.request('PATCH', `/faces/${faceId}`, { body });
  }

  async delete(faceId: string): Promise<void> {
    await this.http.request('DELETE', `/faces/${faceId}`);
  }

  async byTemplate(templateId: string): Promise<Face[]> {
    return this.http.request('GET', `/faces/template/${templateId}`);
  }
}
