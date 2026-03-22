# DUAL TypeScript SDK

[![npm version](https://img.shields.io/badge/npm-v0.1.0--beta-blue)](https://github.com/ro-ro-b/dual-sdk-ts/releases/tag/v0.1.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Official TypeScript/JavaScript SDK for the [DUAL tokenization platform](https://dual-docs-gray.vercel.app).

## Install

```bash
# From GitHub (recommended during beta)
npm install git+https://github.com/ro-ro-b/dual-sdk-ts.git
```

## Quick Start

```typescript
import { DualClient } from 'dual-sdk';

const dual = new DualClient({
  token: 'your-api-key',
  authMode: 'api_key',  // 'api_key' | 'bearer' | 'both'
});

// Every method returns typed responses — no `any`
const wallet = await dual.wallets.me();
console.log(wallet.id, wallet.email);

const page = await dual.templates.list({ limit: 10 });
console.log(page.items[0].name);  // Template
console.log(page.next);           // cursor or null
```

## Modules

| Module             | Description                                  |
| ------------------ | -------------------------------------------- |
| `wallets`          | Auth, profile, linking, token refresh        |
| `templates`        | Template CRUD and variations                 |
| `objects`          | Object CRUD, search, graph traversal         |
| `organizations`    | Org management, members, roles, invitations  |
| `payments`         | Payment config and deposit tracking          |
| `storage`          | File upload (FormData) and metadata           |
| `webhooks`         | Webhook CRUD                                 |
| `notifications`    | Push messages and message templates          |
| `eventBus`         | Actions and action types                     |
| `faces`            | Face CRUD, by-template lookup                |
| `sequencer`        | Batch and checkpoint tracking                |
| `indexer`          | Public read-only: templates, objects, stats  |
| `apiKeys`          | API key management                           |
| `support`          | Support messages and access requests         |

## Configuration

```typescript
const dual = new DualClient({
  token: 'your-token',
  authMode: 'api_key',        // default: 'bearer'
  baseUrl: 'https://gateway-48587430648.europe-west6.run.app',  // default
  timeout: 30_000,            // ms, default: 30000
  retry: {
    maxAttempts: 3,           // default: 3
    backoffMs: 1000,          // base delay, default: 1000
  },
});
```

## Error Handling

```typescript
import {
  DualError,
  DualAuthError,
  DualNotFoundError,
  DualRateLimitError,
  DualTimeoutError,
} from 'dual-sdk';

try {
  await dual.objects.get('missing-id');
} catch (err) {
  if (err instanceof DualNotFoundError) {
    console.log('Not found:', err.code);
  } else if (err instanceof DualRateLimitError) {
    console.log('Retry after:', err.retryAfter, 'seconds');
  } else if (err instanceof DualAuthError) {
    console.log('Auth failed — check your token');
  }
}
```

## Authentication

### OTP Flow

```typescript
// Step 1: Request OTP
await dual.wallets.requestOtp('user@example.com');

// Step 2: Login with OTP
const tokens = await dual.wallets.loginWithOtp('user@example.com', '123456');
dual.setToken(tokens.access_token);

// Step 3: Switch organization (if needed)
const orgTokens = await dual.wallets.switchOrganization('org-id');
dual.setToken(orgTokens.access_token);
```

## Event Bus

```typescript
// Execute an action with the new payload format
await dual.eventBus.execute({
  action: {
    transfer: {
      id: 'object-id',
      to: 'recipient-wallet-id',
    },
  },
});

// Or mint a new object
await dual.eventBus.execute({
  action: {
    mint: {
      template_id: 'template-id',
      custom: { /* custom properties */ },
    },
  },
});

// List action logs
const logs = await dual.eventBus.listActions({ limit: 20 });
console.log(logs.items);

// Get a specific action
const action = await dual.eventBus.getAction('action-id');
```

## File Uploads

```typescript
const formData = new FormData();
formData.append('file', myFile);

const record = await dual.storage.upload(formData);
console.log(record.id, record.url);
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- TypeScript 5+ (for strict mode support)

## Links

- [Documentation](https://dual-docs-gray.vercel.app/docs/developer-kit/sdk)
- [Python SDK](https://github.com/ro-ro-b/dual-sdk-python)
- [API Reference](https://dual-docs-gray.vercel.app/docs/developer-kit/api-reference)

## License

MIT — see [LICENSE](./LICENSE).
