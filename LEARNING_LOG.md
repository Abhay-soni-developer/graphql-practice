# Learning Log

## Stage 1 — HTTP foundation

- **App versus startup:** assemble middleware and routes in [app.ts](./src/app.ts); open the listening port in [index.ts](./src/index.ts).
- **Configuration:** load environment settings with dotenv and validate them with zod in [config.ts](./src/config.ts).
- **Routing:** mount handlers in [routes/index.ts](./src/routes/index.ts); return health JSON in [health.ts](./src/routes/health.ts).
- **TypeScript/ESM:** strict checks, NodeNext imports, and `src` compilation scope in [tsconfig.json](./tsconfig.json).
- **Manual exercise:** Requestly `health` → HTTP 200 with `status: "OK"`.
- **Theory context:** [My notes — Introduction](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.0). This stage establishes HTTP foundations before GraphQL execution.

## Stage 2 — Basic GraphQL query

- **Object type:** `GraphQLObjectType` defines the root Query fields in [schema.ts](./src/graphql/schema.ts).
- **Schema:** `GraphQLSchema` registers that object as the query root in the same file.
- **Field type:** `GraphQLNonNull(GraphQLString)` declares `hello: String!`.
- **Resolver:** the explicit `hello` resolver returns the fixed string `"Hello, GraphQL!"`; no arguments or root value are needed yet.
- **Libraries:** `graphql` supplies types, validation, and execution; `graphql-http` mounts execution through Express in [routes/index.ts](./src/routes/index.ts).
- **Manual exercise:** Requestly `hello` sends `{ "query": "{ hello }" }`; expect `{ "data": { "hello": "Hello, GraphQL!" } }`.
- **Theory:** [My notes — Introduction](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.0) → schema contract and execution pipeline; [Object types, schema, and resolution](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.d81409p2lts).

## Stage 3 — Required arguments and variables

- **Arguments:** `hello(name: String!)` reads `args.name` in [schema.ts](./src/graphql/schema.ts); non-null requires a supplied string but still permits an empty string.
- **Variables:** a named operation declares `$name: String!`; the JSON `variables` object supplies its value separately.
- **Validation:** missing `name` and numeric input are rejected before the greeting resolver runs.
- **Manual examples:** Requestly `helloWithName` and `welcome-Variables` succeed; `graphql - missing arguments` and `graphql - wrong type` intentionally fail validation. The earlier `hello` request was renamed for the new required argument.
- **Verification:** type-checking passed, and direct execution of all four saved operations produced the expected data/errors. A new HTTP smoke check was not run for this stage.
- **Theory:** [My notes — Arguments vs. Variables](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.sl5vmcf3ax20).

## Stage 4 — Default versus explicit root resolution

- **Root value:** [root-value.ts](./src/graphql/root-value.ts) supplies `version: "1.0.0"`; [routes/index.ts](./src/routes/index.ts) passes it to the GraphQL handler.
- **Default resolution:** `version` has no explicit resolver in [schema.ts](./src/graphql/schema.ts), so GraphQL reads `rootValue.version`.
- **Explicit resolution:** `hello` uses its field resolver; the alternate `rootValue.hello` function is bypassed unless explicitly called or the field resolver is removed.
- **Types:** [types.ts](./src/utils/types/types.ts) defines `HelloQueryParam`; `GraphQLResolveInfo` describes execution metadata, and `typeof rootValue` derives the root object's TypeScript type.
- **Manual example:** Requestly `getVersion` returns `version: "1.0.0"`. Selecting `hello(name: "Abhay")` alongside `version` demonstrates both resolution paths.
- **Verification:** isolated stage 4 type-checking and compilation passed; the saved version operation and explicit-resolver precedence passed direct execution. Later-stage untracked files currently have missing user-type imports and are excluded from this snapshot.
- **Theory:** [My notes — Object types, schema, and default/explicit resolution](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.d81409p2lts).

## Stage 5 — User objects and nested resolver parent values

- **Object contract:** [user.schema.ts](./src/modules/user/user.schema.ts) defines `User` and nullable `user(id: ID!): User`; [schema.ts](./src/graphql/schema.ts) composes the feature query.
- **Lookup:** [user.resolver.ts](./src/modules/user/user.resolver.ts) delegates to [user.service.ts](./src/modules/user/user.service.ts), which reads the seeded Map in [data.ts](./src/utils/data.ts).
- **Parent values:** the returned user becomes the source for its fields. Default resolution reads `id`, `name`, and `email`; the explicit `greeting` resolver computes a string from `parent.name`.
- **Selection:** the greeting resolver runs only when `greeting` is requested. Resolver logs make this visible.
- **Examples:** Requestly `getUser` selects the greeting; `getUser-Variable` demonstrates an ID variable and ordinary fields.
- **Verification:** type-checking, isolated compilation, saved query execution, lookup success/failure, and greeting selection checks passed. No new HTTP smoke check or persistent automated test suite was added.
- **Theory:** [My notes — Root and field-level resolvers](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.f2sw8qc1hp1z).

## Stage 6 — Lists, nullability, and query composition

- **Lists:** [user.schema.ts](./src/modules/user/user.schema.ts) defines `[User!]!`, and [user.service.ts](./src/modules/user/user.service.ts) returns an array; an empty array is valid ([notes: Introduction/nullability](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.0)).
- **Nullable values and partial errors:** nullable `email` can be null without errors; a missing nullable `user` returns null plus an error while `version` survives ([resolver](./src/modules/user/user.resolver.ts), [notes: Null propagation](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.xq00qkv71pyy)).
- **List request:** [getUsersList](<./api-requests/apis/Graphql Practice/getUsersList/__body.json>) selects user IDs/names alongside the API version.
- **Variables:** [graphql-fragments-variables](<./api-requests/apis/Graphql Practice/graphql-fragments-variables/__query.json>) supplies `$id` separately from the reusable query document ([notes: Variables](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.sl5vmcf3ax20)).
- **Aliases:** [graphql-alias](<./api-requests/apis/Graphql Practice/graphql-alias/__query.json>) and [HTTP alias example](<./api-requests/apis/Graphql Practice/graphql-http-alias-request/__body.json>) rename response fields and fetch users with different arguments without changing the schema ([notes: Aliases](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.5808gl3cjns2)).
- **Named fragments:** [graphql-fragments-variables](<./api-requests/apis/Graphql Practice/graphql-fragments-variables/__query.json>) reuses the `UserSelectedFields` selection on `User` ([notes: Fragments](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.nf8gykt6rmzn)).
- **Inline fragments:** [graphql-inline-fragments](<./api-requests/apis/Graphql Practice/graphql-inline-fragments/__query.json>) applies an unnamed `... on User` type-conditioned selection ([notes: Fragments](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.nf8gykt6rmzn)).
- **Verification:** type-checking, isolated compilation, all five saved operations, nullable email, partial errors, and empty-list behavior passed; checks used direct execution, not a new HTTP smoke check.

## Stage 7 — User creation mutations and feature types

- **Mutation root:** [schema.ts](./src/graphql/schema.ts) registers `Mutation`; [user.schema.ts](./src/modules/user/user.schema.ts) exports `createUser(name: String!, email: String): User`.
- **State change:** [user.resolver.ts](./src/modules/user/user.resolver.ts) delegates creation to [user.service.ts](./src/modules/user/user.service.ts), which generates an ID, stores the user, and returns it.
- **Response selection:** [createUser-Mutation](<./api-requests/apis/Graphql Practice/createUser-Mutation/__query.json>) selects the new user's ID, name, email, and computed greeting.
- **Optional input:** omitted or null email becomes null; missing name is rejected by GraphQL, while blank-name/email-format validation remains future work.
- **Feature types:** [user.type.ts](./src/modules/user/user.type.ts) owns `User`, `UserRecords`, and `CreateUserRequest`; the latter marks email optional to match GraphQL arguments.
- **Verification:** isolated type-check/build, saved mutation, generated IDs, lookup/list after creation, omitted/null email, and missing-name checks passed through direct execution; no new HTTP smoke check or persistent test suite was added.
- **Theory:** [My notes — Mutations](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.n615e93gaxx7).

Data is in memory and disappears on restart; mutations do not automatically provide database persistence, transactions, or business validation.

## Stage 8 — Shared HTTP/WebSocket transport

- **Shared server:** [index.ts](./src/index.ts) uses `createServer(app)` so HTTP requests and WebSocket upgrades share one port and `/graphql` path.
- **Libraries:** `ws` manages connections; `graphql-ws` supplies the GraphQL WebSocket protocol and executes the existing schema.
- **Root values:** `roots` supplies the existing root data for operations executed over WebSocket.
- **Scope:** transport is enabled first; message subscriptions and graceful shutdown are separate subsequent commits.
- **Verification:** the transport-only snapshot passed type-checking and compilation; HTTP health/query and a GraphQL WebSocket query worked on the same port and `/graphql` path.
- **Theory:** [My notes — Subscriptions](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.eyqdtl292mjb).

### Planned reconstructed author dates

| Stage | Commit scope | Author date |
| --- | --- | --- |
| 8 | WebSocket transport setup | January 9, 2026 |
| 9 | Shutdown handler and signal wiring | January 10, 2026 |
| 10 | Message subscription implementation | January 11, 2026 |
| 11 | Subscription testing | January 12, 2026 |

Each upcoming stage will receive its own short entry when verified. These are reconstructed author dates; actual committer dates are retained.
