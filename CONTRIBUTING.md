# Contributing

Thanks for your interest in contributing to the DUAL TypeScript SDK!

## Development Setup

```bash
git clone https://github.com/ro-ro-b/dual-sdk-ts.git
cd dual-sdk-ts
npm install
```

## Commands

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run typecheck` | Type-check with `tsc`     |
| `npm test`          | Run tests with vitest     |
| `npm run build`     | Build ESM + CJS with tsup |

## Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes
3. Ensure `npm run typecheck` and `npm test` pass
4. Open a PR against `main`

## Code Style

- TypeScript strict mode is enabled
- Every public method should have a typed return type (no `any`)
- New API types go in `src/types.ts`
- New modules go in `src/modules/` and must be wired into `src/client.ts`

## Reporting Issues

Use GitHub Issues. Include your SDK version, Node version, and a minimal reproduction.
