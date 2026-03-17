/**
 * DUAL Platform SDK — Shared type definitions.
 *
 * Every API method returns a concrete type instead of `any`.
 * All interfaces use `extra` properties for forward-compatible API fields.
 */

// ── Pagination ──────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}

// ── Auth ────────────────────────────────────────────────

export interface TokenPair {
  access_token: string;
  refresh_token: string | null;
  token_type?: string;
}

export interface Wallet {
  id: string;
  email?: string | null;
  name?: string | null;
  avatar?: string | null;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Templates ───────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description?: string | null;
  organization_id?: string | null;
  properties?: Record<string, unknown>;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface Variation {
  id: string;
  template_id: string;
  name: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Objects ─────────────────────────────────────────────

export interface DualObject {
  id: string;
  template_id: string;
  owner_id?: string | null;
  properties?: Record<string, unknown>;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

// ── Organizations ───────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  description?: string | null;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Member {
  id: string;
  wallet_id: string;
  role?: string | null;
  organization_id?: string | null;
  [key: string]: unknown;
}

export interface Role {
  id: string;
  name: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface Invitation {
  id: string;
  email?: string | null;
  organization_id?: string | null;
  status?: string;
  [key: string]: unknown;
}

// ── Payments ────────────────────────────────────────────

export interface PaymentConfig {
  multi_token_deposit_address?: string | null;
  vee_address?: string | null;
  supported_tokens?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface Deposit {
  id?: string;
  tx_hash?: string | null;
  token?: string | null;
  amount?: string | null;
  [key: string]: unknown;
}

// ── Webhooks ────────────────────────────────────────────

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret?: string | null;
  active?: boolean;
  [key: string]: unknown;
}

// ── Event Bus ───────────────────────────────────────────

export interface Action {
  id?: string;
  action_type?: string;
  status?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ActionType {
  id: string;
  name: string;
  description?: string | null;
  [key: string]: unknown;
}

// ── Faces ───────────────────────────────────────────────

export interface Face {
  id: string;
  template_id?: string | null;
  display_type?: string | null;
  resources?: string[];
  [key: string]: unknown;
}

// ── Storage ─────────────────────────────────────────────

export interface FileRecord {
  id: string;
  url?: string | null;
  content_type?: string | null;
  size?: number | null;
  [key: string]: unknown;
}

// ── Sequencer ───────────────────────────────────────────

export interface Batch {
  id: string;
  status?: string | null;
  action_count?: number | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface Checkpoint {
  id: string;
  batch_id?: string | null;
  merkle_root?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

// ── Notifications ───────────────────────────────────────

export interface Message {
  id: string;
  content?: string | null;
  sent_at?: string | null;
  [key: string]: unknown;
}

export interface MessageTemplate {
  id: string;
  name: string;
  body?: string | null;
  [key: string]: unknown;
}

// ── API Keys ────────────────────────────────────────────

export interface ApiKey {
  id: string;
  name?: string | null;
  key?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

// ── Support ─────────────────────────────────────────────

export interface SupportMessage {
  id: string;
  content?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

// ── Public / Indexer ────────────────────────────────────

export interface PublicStats {
  total_templates?: number | null;
  total_objects?: number | null;
  total_organizations?: number | null;
  [key: string]: unknown;
}

// ── Request types ──────────────────────────────────────
// Typed payloads for create/update/search operations.
// Each uses `& { [key: string]: unknown }` for forward-compatible extra fields.

/** Pagination params accepted by list endpoints. */
export interface PaginationParams {
  limit?: number;
  next?: string;
  [key: string]: unknown;
}

/** POST /templates */
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  organization_id?: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/** POST /templates/:id/variations */
export interface CreateVariationRequest {
  name: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/** PATCH /templates/:id */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/** POST /objects */
export interface CreateObjectRequest {
  template_id: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/** PATCH /objects/:id */
export interface UpdateObjectRequest {
  properties?: Record<string, unknown>;
  owner_id?: string;
  [key: string]: unknown;
}

/** POST /objects/search */
export interface SearchObjectsRequest {
  template_id?: string;
  owner_id?: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/** POST /organizations */
export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

/** POST /organizations/:id/members */
export interface AddMemberRequest {
  wallet_id: string;
  role?: string;
  [key: string]: unknown;
}

/** POST /organizations/:id/roles */
export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
  [key: string]: unknown;
}

/** POST /organizations/:id/invitations */
export interface InviteRequest {
  email: string;
  role?: string;
  [key: string]: unknown;
}

/** POST /webhooks */
export interface CreateWebhookRequest {
  url: string;
  events: string[];
  secret?: string;
  active?: boolean;
  [key: string]: unknown;
}

/** PATCH /webhooks/:id */
export interface UpdateWebhookRequest {
  url?: string;
  events?: string[];
  active?: boolean;
  [key: string]: unknown;
}

/** POST /ebus/actions */
export interface ExecuteActionRequest {
  action_type: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

/** POST /ebus/action-types */
export interface CreateActionTypeRequest {
  name: string;
  description?: string;
  [key: string]: unknown;
}

/** POST /faces */
export interface CreateFaceRequest {
  template_id: string;
  display_type?: string;
  resources?: string[];
  [key: string]: unknown;
}

/** PATCH /faces/:id */
export interface UpdateFaceRequest {
  display_type?: string;
  resources?: string[];
  [key: string]: unknown;
}

/** POST /messages/send */
export interface SendMessageRequest {
  content: string;
  [key: string]: unknown;
}

/** POST /messages/templates */
export interface CreateMessageTemplateRequest {
  name: string;
  body: string;
  [key: string]: unknown;
}

/** POST /api-keys */
export interface CreateApiKeyRequest {
  name?: string;
  [key: string]: unknown;
}

/** POST /support */
export interface SendSupportMessageRequest {
  content: string;
  [key: string]: unknown;
}

/** POST /support/request-access */
export interface RequestAccessRequest {
  feature: string;
  reason?: string;
  [key: string]: unknown;
}

// ── Wallet request types ────────────────────────────────

export interface RegisterWalletRequest {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

export interface LinkWalletRequest {
  provider: string;
  token?: string;
  [key: string]: unknown;
}

export interface UpdateWalletRequest {
  name?: string;
  avatar?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Auth Mode ───────────────────────────────────────────

export type AuthMode = 'api_key' | 'bearer' | 'both';

// ── Config ──────────────────────────────────────────────

export interface DualConfig {
  /** API key or JWT token */
  token?: string;
  /** How the token is sent: 'api_key' (x-api-key header), 'bearer' (Authorization), or 'both'. Default: 'bearer'. */
  authMode?: AuthMode;
  /** Base URL for API requests. Default: https://blockv-labs.io */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30000 */
  timeout?: number;
  /** Custom fetch implementation (for Node < 18 or testing) */
  fetch?: typeof globalThis.fetch;
  /** Retry configuration */
  retry?: {
    /** Maximum retry attempts (default: 3) */
    maxAttempts?: number;
    /** Base backoff in ms (default: 1000) */
    backoffMs?: number;
  };
}
