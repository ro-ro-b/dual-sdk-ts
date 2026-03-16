# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-17

### Added

- Full TypeScript type definitions for all 14 API modules
- Typed request/response interfaces for every endpoint
- `DualClient` with modular resource access (wallets, templates, objects, etc.)
- Dual auth support: API key (`x-api-key`), Bearer token, or both
- Smart retries on 429 and 5xx only (with exponential backoff)
- Rich error hierarchy: `DualAuthError`, `DualNotFoundError`, `DualRateLimitError`, `DualTimeoutError`
- FormData support for file uploads (no global Content-Type override)
- Generic `PaginatedResponse<T>` for cursor-based pagination
- Forward-compatible interfaces with `[key: string]: unknown`
- ESM + CJS dual exports via tsup
- Vitest test suite
- Security policy, contributing guide, and changelog
