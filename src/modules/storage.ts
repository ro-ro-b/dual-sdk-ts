import type { HttpTransport } from '../transport.js';
import type { FileRecord } from '../types.js';

export class StorageModule {
  constructor(private http: HttpTransport) {}

  /** Upload a file. Pass a FormData instance for multipart upload. */
  async upload(formData: FormData): Promise<FileRecord> {
    return this.http.request('POST', '/storage/upload', { formData });
  }

  async get(fileId: string): Promise<FileRecord> {
    return this.http.request('GET', `/storage/${fileId}`);
  }

  async delete(fileId: string): Promise<void> {
    await this.http.request('DELETE', `/storage/${fileId}`);
  }

  async templateAssets(templateId: string): Promise<FileRecord[]> {
    return this.http.request('GET', `/storage/template/${templateId}`);
  }

  async uploadTemplateAsset(templateId: string, formData: FormData): Promise<FileRecord> {
    return this.http.request('POST', `/storage/template/${templateId}`, { formData });
  }
}
