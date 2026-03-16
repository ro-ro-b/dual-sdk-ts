import type { HttpTransport } from '../transport.js';
import type { TokenPair, Wallet, PaginatedResponse } from '../types.js';

export class WalletsModule {
  constructor(private http: HttpTransport) {}

  async login(email: string, password: string): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/login', { body: { email, password } });
  }

  async guestLogin(): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/login/guest');
  }

  async register(email: string, password: string, extra?: Record<string, unknown>): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/register', { body: { email, password, ...extra } });
  }

  async verifyRegistration(token: string): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/register/verify', { body: { token } });
  }

  async requestResetCode(email: string): Promise<unknown> {
    return this.http.request('POST', '/wallets/reset-code', { body: { email } });
  }

  async verifyResetCode(code: string, newPassword: string): Promise<unknown> {
    return this.http.request('POST', '/wallets/reset-code/verify', { body: { code, new_password: newPassword } });
  }

  async me(): Promise<Wallet> {
    return this.http.request('GET', '/wallets/me');
  }

  async updateMe(fields: Partial<Wallet>): Promise<Wallet> {
    return this.http.request('PATCH', '/wallets/me', { body: fields });
  }

  async deleteMe(): Promise<void> {
    await this.http.request('DELETE', '/wallets/me');
  }

  async linked(): Promise<Wallet[]> {
    return this.http.request('GET', '/wallets/me/linked');
  }

  async get(walletId: string): Promise<Wallet> {
    return this.http.request('GET', `/wallets/${walletId}`);
  }

  async getLinked(walletId: string): Promise<Wallet[]> {
    return this.http.request('GET', `/wallets/${walletId}/linked`);
  }

  async link(body: Record<string, unknown>): Promise<Wallet> {
    return this.http.request('POST', '/wallets/link', { body });
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/token/refresh', { body: { refresh_token: refreshToken } });
  }
}
