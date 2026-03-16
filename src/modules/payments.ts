import type { HttpTransport } from '../transport.js';
import type { PaymentConfig, Deposit } from '../types.js';

export class PaymentsModule {
  constructor(private http: HttpTransport) {}

  async config(): Promise<PaymentConfig> {
    return this.http.request('GET', '/payments/config');
  }

  async listDeposits(params?: { tx_hash?: string; token?: string; token_address?: string }): Promise<Deposit[]> {
    return this.http.request('GET', '/payments/deposits', { query: params });
  }
}
