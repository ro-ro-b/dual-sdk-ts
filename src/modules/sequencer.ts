import type { HttpTransport } from '../transport.js';
import type { Batch, Checkpoint, PaginatedResponse } from '../types.js';

export class SequencerModule {
  constructor(private http: HttpTransport) {}

  async listBatches(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Batch>> {
    return this.http.request('GET', '/batches', { query: params });
  }

  async getBatch(batchId: string): Promise<Batch> {
    return this.http.request('GET', `/batches/${batchId}`);
  }

  async listCheckpoints(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Checkpoint>> {
    return this.http.request('GET', '/checkpoints', { query: params });
  }

  async getCheckpoint(checkpointId: string): Promise<Checkpoint> {
    return this.http.request('GET', `/checkpoints/${checkpointId}`);
  }
}
