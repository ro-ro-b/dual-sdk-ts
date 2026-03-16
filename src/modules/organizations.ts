import type { HttpTransport } from '../transport.js';
import type {
  Organization, Member, Role, Invitation, PaginatedResponse, PaginationParams,
  CreateOrganizationRequest, AddMemberRequest, CreateRoleRequest, InviteRequest,
} from '../types.js';

export class OrganizationsModule {
  constructor(private http: HttpTransport) {}

  async list(params?: PaginationParams): Promise<PaginatedResponse<Organization>> {
    return this.http.request('GET', '/organizations', { query: params });
  }

  async create(body: CreateOrganizationRequest): Promise<Organization> {
    return this.http.request('POST', '/organizations', { body });
  }

  async get(orgId: string): Promise<Organization> {
    return this.http.request('GET', `/organizations/${orgId}`);
  }

  async update(orgId: string, body: Partial<Organization>): Promise<Organization> {
    return this.http.request('PUT', `/organizations/${orgId}`, { body });
  }

  async balance(orgId: string): Promise<unknown> {
    return this.http.request('GET', `/organizations/${orgId}/balance`);
  }

  async balanceHistory(orgId: string, params?: PaginationParams): Promise<unknown> {
    return this.http.request('GET', `/organizations/${orgId}/balance/history`, { query: params });
  }

  // Members
  async listMembers(orgId: string, params?: PaginationParams): Promise<PaginatedResponse<Member>> {
    return this.http.request('GET', `/organizations/${orgId}/members`, { query: params });
  }

  async addMember(orgId: string, body: AddMemberRequest): Promise<Member> {
    return this.http.request('POST', `/organizations/${orgId}/members`, { body });
  }

  async removeMember(orgId: string, memberId: string): Promise<void> {
    await this.http.request('DELETE', `/organizations/${orgId}/members/${memberId}`);
  }

  async updateMemberRole(orgId: string, memberId: string, role: string): Promise<Member> {
    return this.http.request('PATCH', `/organizations/${orgId}/members/${memberId}`, { body: { role } });
  }

  // Roles
  async listRoles(orgId: string): Promise<Role[]> {
    return this.http.request('GET', `/organizations/${orgId}/roles`);
  }

  async createRole(orgId: string, body: CreateRoleRequest): Promise<Role> {
    return this.http.request('POST', `/organizations/${orgId}/roles`, { body });
  }

  async updateRole(orgId: string, roleId: string, body: Partial<Role>): Promise<Role> {
    return this.http.request('PATCH', `/organizations/${orgId}/roles/${roleId}`, { body });
  }

  async deleteRole(orgId: string, roleId: string): Promise<void> {
    await this.http.request('DELETE', `/organizations/${orgId}/roles/${roleId}`);
  }

  // Invitations
  async invite(orgId: string, body: InviteRequest): Promise<Invitation> {
    return this.http.request('POST', `/organizations/${orgId}/invitations`, { body });
  }

  async listInvitations(orgId: string): Promise<Invitation[]> {
    return this.http.request('GET', `/organizations/${orgId}/invitations`);
  }

  async deleteInvitation(orgId: string, invitationId: string): Promise<void> {
    await this.http.request('DELETE', `/organizations/${orgId}/invitations/${invitationId}`);
  }

  async acceptInvitation(invitationId: string): Promise<unknown> {
    return this.http.request('POST', `/organizations/invitations/${invitationId}/accept`);
  }
}
