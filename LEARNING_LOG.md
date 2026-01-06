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

Next: user lists, nullable values, and missing-user errors.
