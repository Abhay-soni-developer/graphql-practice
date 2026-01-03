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

Next: add a required greeting argument, then variables and invalid-input examples. Record those concepts after implementation and verification.
