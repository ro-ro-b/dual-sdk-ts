/**
 * DUAL Platform SDK for TypeScript / JavaScript.
 *
 * @packageDocumentation
 */

// ── Client ─────────────────────────────────────────────
export { DualClient } from './client.js';

// ── Transport (advanced) ───────────────────────────────
export { HttpTransport } from './transport.js';

// ── Errors ─────────────────────────────────────────────
export {
  DualError,
  DualAuthError,
  DualNotFoundError,
  DualRateLimitError,
  DualTimeoutError,
} from './errors.js';

// ── Types (response) ──────────────────────────────────
export type {
  DualConfig,
  AuthMode,
  PaginatedResponse,
  PaginationParams,
  TokenPair,
  Wallet,
  Template,
  Variation,
  DualObject,
  Organization,
  Member,
  Role,
  Invitation,
  PaymentConfig,
  Deposit,
  Webhook,
  Action,
  ActionType,
  Face,
  FileRecord,
  Batch,
  Checkpoint,
  Message,
  MessageTemplate,
  ApiKey,
  SupportMessage,
  PublicStats,
} from './types.js';

// ── Types (request) ───────────────────────────────────
export type {
  CreateTemplateRequest,
  CreateVariationRequest,
  UpdateTemplateRequest,
  CreateObjectRequest,
  UpdateObjectRequest,
  SearchObjectsRequest,
  CreateOrganizationRequest,
  AddMemberRequest,
  CreateRoleRequest,
  InviteRequest,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  ExecuteActionRequest,
  CreateActionTypeRequest,
  CreateFaceRequest,
  UpdateFaceRequest,
  SendMessageRequest,
  CreateMessageTemplateRequest,
  CreateApiKeyRequest,
  SendSupportMessageRequest,
  RequestAccessRequest,
} from './types.js';
