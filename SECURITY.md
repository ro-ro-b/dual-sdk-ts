# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email **security@blockv-labs.io** with a description of the issue
3. Include steps to reproduce if possible
4. We will acknowledge within 48 hours and provide a timeline for a fix

## Security Practices

- This SDK never logs or stores API tokens beyond the current session
- Tokens are sent only to the configured `baseUrl` (default: `https://blockv-labs.io`)
- All HTTP requests use HTTPS by default
- Dependencies are kept to a minimum to reduce supply-chain risk
