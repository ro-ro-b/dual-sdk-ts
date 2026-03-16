import type { HttpTransport } from '../transport.js';
import type { ApiKey, CreateApiKeyRequest } from '../types.js';

export class ApiKeysModule {
  constructor(private http: HttpTransport) {}

  async list(): Promise<ApiKey[]> {
    return this.http.request('GET', '/api-keys');
  }

  async create(body?: CreateApiKeyRequest): Promise<ApiKey> {
    return this.http.request('POST', '/api-keys', { body });
  }

  async delete(apiKeyId: string): Promise<void> {
    await this.http.request('DELETE', `/api-keys/${apiKeyId}`);
  }
}
