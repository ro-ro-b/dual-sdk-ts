/**
 * DualClient — main entry point for the DUAL Platform SDK.
 *
 * ```ts
 * import { DualClient } from 'dual-sdk';
 *
 * const dual = new DualClient({ token: 'your-api-key', authMode: 'api_key' });
 * const wallet = await dual.wallets.me();
 * ```
 */

import type { DualConfig } from './types.js';
import { HttpTransport } from './transport.js';

import { WalletsModule } from './modules/wallets.js';
import { TemplatesModule } from './modules/templates.js';
import { ObjectsModule } from './modules/objects.js';
import { OrganizationsModule } from './modules/organizations.js';
import { PaymentsModule } from './modules/payments.js';
import { StorageModule } from './modules/storage.js';
import { WebhooksModule } from './modules/webhooks.js';
import { NotificationsModule } from './modules/notifications.js';
import { EventBusModule } from './modules/eventbus.js';
import { FacesModule } from './modules/faces.js';
import { SequencerModule } from './modules/sequencer.js';
import { IndexerModule } from './modules/indexer.js';
import { ApiKeysModule } from './modules/apikeys.js';
import { SupportModule } from './modules/support.js';

export class DualClient {
  private readonly _transport: HttpTransport;

  /** Wallet auth, profile, and linking */
  readonly wallets: WalletsModule;
  /** Template CRUD and variations */
  readonly templates: TemplatesModule;
  /** Object CRUD, search, and graph traversal */
  readonly objects: ObjectsModule;
  /** Organization management, members, roles, invitations */
  readonly organizations: OrganizationsModule;
  /** Payment config and deposits */
  readonly payments: PaymentsModule;
  /** File upload and metadata */
  readonly storage: StorageModule;
  /** Webhook management */
  readonly webhooks: WebhooksModule;
  /** Push notifications and message templates */
  readonly notifications: NotificationsModule;
  /** Actions and action types */
  readonly eventBus: EventBusModule;
  /** Face CRUD and template faces */
  readonly faces: FacesModule;
  /** Batch and checkpoint tracking */
  readonly sequencer: SequencerModule;
  /** Public read-only endpoints (templates, objects, orgs, stats) */
  readonly indexer: IndexerModule;
  /** API key management */
  readonly apiKeys: ApiKeysModule;
  /** Support messages and access requests */
  readonly support: SupportModule;

  constructor(config: DualConfig = {}) {
    this._transport = new HttpTransport(config);

    this.wallets = new WalletsModule(this._transport);
    this.templates = new TemplatesModule(this._transport);
    this.objects = new ObjectsModule(this._transport);
    this.organizations = new OrganizationsModule(this._transport);
    this.payments = new PaymentsModule(this._transport);
    this.storage = new StorageModule(this._transport);
    this.webhooks = new WebhooksModule(this._transport);
    this.notifications = new NotificationsModule(this._transport);
    this.eventBus = new EventBusModule(this._transport);
    this.faces = new FacesModule(this._transport);
    this.sequencer = new SequencerModule(this._transport);
    this.indexer = new IndexerModule(this._transport);
    this.apiKeys = new ApiKeysModule(this._transport);
    this.support = new SupportModule(this._transport);
  }

  /** Update the auth token (e.g. after login or token refresh). */
  setToken(token: string): void {
    this._transport.setToken(token);
  }

  /** Get the current auth token. */
  getToken(): string | undefined {
    return this._transport.getToken();
  }
}
