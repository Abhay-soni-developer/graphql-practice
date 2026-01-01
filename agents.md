# Project Coding Rules (Node + TS + GraphQL)

## TypeScript
- "strict": true mindset: no `any`, prefer `unknown` + narrowing
- Use zod for runtime validation at API boundaries
- Prefer pure functions + explicit return types for exported functions

## Node/Express
- No business logic in routes. Route -> service -> repo layers.
- Errors: throw typed errors; one centralized error middleware.

## GraphQL
- Resolvers must be thin: delegate to service layer.
- Avoid N+1: use DataLoader for any nested/looped fetch.
- Always design schema with nullability intentionally (no lazy `String` vs `String!`).

## Testing
- For every new resolver: add unit test for service + integration test for resolver (happy + failure).