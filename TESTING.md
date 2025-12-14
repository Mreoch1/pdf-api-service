# Testing & Logging Guide

## Testing

### Unit Tests
Run unit tests with Jest:
```bash
npm test
```

### Watch Mode
Run tests in watch mode during development:
```bash
npm run test:watch
```

### Coverage
Generate test coverage report:
```bash
npm run test:coverage
```

### API Integration Tests
Test the actual API endpoints (requires dev server running):
```bash
# Start dev server first
npm run dev

# In another terminal, run API tests
npm run test:api

# Or with custom URL and API key
./scripts/test-api.sh http://localhost:3000 your_api_key_here
```

## Logging

### Logger Usage

The application uses a centralized logger (`lib/logger.ts`) with the following levels:

```typescript
import { logger } from '@/lib/logger'

// Debug (only in development)
logger.debug('Debug message', { metadata: 'value' })

// Info
logger.info('Info message', { userId: '123' })

// Warning
logger.warn('Warning message', { action: 'test' })

// Error
logger.error('Error message', error, { context: 'value' })
```

### Log Levels

- **debug**: Development-only detailed information
- **info**: General informational messages
- **warn**: Warning messages for potential issues
- **error**: Error messages with optional error objects

### Log Format

Logs are formatted as:
```
[timestamp] [LEVEL] message | Metadata: {...} | Error: ... | Stack: ...
```

### Production Logging

In production, logs are:
- Sent to console (Vercel captures these)
- Can be integrated with services like:
  - Sentry (error tracking)
  - LogRocket (session replay)
  - Datadog (monitoring)

## Test Files

- `__tests__/api/pdf/generate.test.ts` - PDF generation API tests
- `__tests__/lib/logger.test.ts` - Logger utility tests

## Adding New Tests

1. Create test file: `__tests__/path/to/file.test.ts`
2. Import the module to test
3. Mock external dependencies
4. Write test cases
5. Run: `npm test`

## Continuous Integration

Tests should run automatically on:
- Pre-commit (via husky, if configured)
- Pull requests
- Deployments

