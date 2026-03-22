import type { HttpTransport } from '../transport.js';
import type {
  TokenPair, Wallet,
  RegisterWalletRequest, LinkWalletRequest, UpdateWalletRequest,
} from '../types.js';

export class WalletsModule {
  constructor(private http: HttpTransport) {}

  async requestOtp(email: string): Promise<void> {
    await this.http.request('POST', '/auth/otp', { body: { email } });
  }

  async loginWithOtp(email: string, otp: string): Promise<TokenPair> {
    return this.http.request('POST', '/auth/login', { body: { email, otp } });
  }

  async switchOrganization(orgId: string): Promise<TokenPair> {
    return this.http.request('POST', '/organizations/switch', { body: { id: orgId } });
  }

  async guestLogin(): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/login/guest');
  }

  async register(body: RegisterWalletRequest): Promise<TokenPair> {
    return this.http.request('POST', '/wallets/register', { body });
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

  async updateMe(body: UpdateWalletRequest): Promise<Wallet> {
    return this.http.request('PATCH', '/wallets/me', { body });
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

  async link(body: LinkWalletRequest): Promise<Wallet> {
    return this.http.request('POST', '/wallets/link', { body });
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return this.http.request('POST', '/auth/refresh-token', { body: { refresh_token: refreshToken } });
  }
}
