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

// ── Types ──────────────────────────────────────────────
export type {
  DualConfig,
  AuthMode,
  PaginatedResponse,
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
