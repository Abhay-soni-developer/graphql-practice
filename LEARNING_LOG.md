# Learning Log

## How to use these notes

Read the concept, inspect the named source files, run the matching Requestly operation, and compare the observed result with the expectation. Record future concepts when implemented and verified; distinguish saved experiments from active application behavior.

Primary theory reference: [My GraphQL notes — Introduction tab](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.0).

This project is a guided rebuild of earlier practice code. Stage order is educational. Reconstructed author dates, if used, are not original implementation timestamps; actual committer dates remain the creation record for the rebuild commits.

## Introduction: why this application will use GraphQL

The introduction notes explain GraphQL as a typed API contract, query language, and execution model over application data sources. Clients select fields exposed by that contract; the server validates the operation and resolves the selected values. GraphQL does not provide storage or business logic automatically.

The execution model to revisit when the endpoint is introduced is:

```text
HTTP request
  → parse the GraphQL operation
  → validate against the schema
  → execute selected fields using resolvers
  → complete values according to field types
  → return data and, when applicable, errors
```

This is theory for the next stages. Stage 1 exercises only ordinary HTTP routing. A simple JSON health endpoint gives a working foundation before adding GraphQL execution.

Revision caveats: clients select only schema-exposed fields; aliases affect response names and errors/nullability can affect the final data. GraphQL does not automatically solve N+1 queries, authorization, caching, or persistence. REST can also support partial responses and efficient data fetching; the notes' comparisons are learning models rather than universal restrictions on REST.

## Library responsibilities

### GraphQL packages — installed, not active in stage 1 HTTP routing

| Package | Responsibility | What it does not provide |
| --- | --- | --- |
| `graphql` | GraphQL.js: constructs schemas and types, parses operations, validates them, and executes resolvers | An Express HTTP server, a database, or application-specific lookup logic |
| `graphql-http` | Adapts GraphQL execution to HTTP; its Express `createHandler` can later mount a supplied schema on `/graphql` | User services, persistence, or a working subscription stream from an empty placeholder |

The intended relationship in stage 2 is:

```text
Express receives the HTTP request
  → graphql-http handles the GraphQL-over-HTTP exchange
  → GraphQL.js validates and executes the operation
  → application resolvers provide values
```

These are installed now but no GraphQL handler is mounted in the current router. No additional GraphQL server framework is required for the existing approach.

### GraphQL.js imports to recognize in later source files

| Import | Purpose | Example in this project |
| --- | --- | --- |
| `GraphQLObjectType` | Define a named output object with fields, arguments, and optional field resolvers | `User`, root `Query`, `Mutation`, and `Subscription` objects |
| `GraphQLSchema` | Register operation roots and assemble the reachable type graph | `{ query: RootQueryType, mutation: RootMutationType }` |
| `GraphQLString` | String scalar | Names, emails, greetings |
| `GraphQLID` | Identifier scalar; GraphQL coerces accepted ID inputs to strings | User IDs |
| `GraphQLNonNull` | Require a non-null value at that position | Required `id` argument or `User.name` |
| `GraphQLList` | Describe a list of another output/input type | `[User!]!` |
| `GraphQLResolveInfo` | TypeScript type for field/execution metadata | Typed resolver `info`; it does not fetch data |

Defining an object type named `Query` alone does not register it as the query root. Assigning it to `GraphQLSchema`'s `query` option gives it that role. Schema construction also does not open an HTTP port.

### Application and development packages

| Package | Why it is here |
| --- | --- |
| `express` | HTTP application, middleware, router, and health response |
| `dotenv` | Load an environment-specific file into `process.env` |
| `zod` | Validate runtime settings; TypeScript types cannot validate environment strings |
| `typescript` | Type-check source and compile it to JavaScript |
| `tsx` | Execute TypeScript during development and restart with watch mode |
| `cross-env` | Set `NODE_ENV=development` using a script that works across operating systems |
| `@types/express` | Express TypeScript declarations; no runtime server implementation |
| `@types/node` | Node.js TypeScript declarations; no replacement for the Node runtime |

Requestly is the external API client for saved manual exercises, not a server dependency. Its local project files are stored in `api-requests/`.

## Stage 1 — Express/TypeScript foundation

### Scope

Create an application that loads validated settings, mounts a health route, and starts an HTTP server. GraphQL implementation is deferred; existing later-stage files are reference material in the current working tree.

### Files to follow

1. `src/config.ts`: select the environment file, load it, validate settings with zod, export a frozen configuration object.
2. `src/app.ts`: create Express, register JSON middleware, mount the router, return the application.
3. `src/routes/index.ts`: mount the health router. No GraphQL handler is registered here yet.
4. `src/routes/health.ts`: respond to `GET /health` with the expected JSON.
5. `src/index.ts`: create the app, listen on the configured port, and handle server startup errors.

### Why app creation and startup are separate

`createApp()` assembles the HTTP behavior without opening a listening port. The entry point owns listening. This separation allows callers to create the application without importing code that automatically starts a server.

```text
Startup: config → createApp() → app.listen(port)
Request: GET /health → mounted router → health handler → JSON
```

The JSON middleware prepares incoming JSON bodies for handlers. The health request has no body and does not need JSON parsing itself.

### Configuration lessons

- The development command sets `NODE_ENV` before starting the process.
- Environment files are loaded relative to the current working directory; run commands from the repository root.
- `dotenv` loads values; zod validates them and converts the port to a number.
- Missing values can receive defaults. Blank strings are present values: blank names fail validation and a blank port becomes zero before failing the allowed range.
- `.env.example` is public documentation; `.env.development` remains local and ignored.
- `config.appEnv` is an application label; `NODE_ENV` selects the file and accepted runtime mode.

### TypeScript and ESM lessons

- `"type": "module"` makes this package use ES modules.
- NodeNext settings model Node.js import resolution.
- Source imports use `.js` paths because Node executes the emitted JavaScript.
- `include: ["src/**/*.ts"]` restricts application compilation; `rootDir` alone does not exclude Requestly scripts.
- `npx tsc --noEmit` checks types; `npm run build` writes compiled files to `dist/`.

### Manual exercise

In Requestly, select **Graphql Practice → health** and send:

```http
GET http://localhost:3000/health
```

Expected status: `200`. Expected body:

```json
{
  "status": "OK",
  "message": "Hello from GraphQL Practice!"
}
```

This verifies HTTP app assembly and routing. It does not prove GraphQL execution, database connectivity, or subscription support. `/graphql` should return `404` at this stage.

### Readiness review

- The active router contains health only.
- A full `tsc --noEmit` check passed during this review.
- Fresh compilation passed with output redirected to a temporary folder, preserving the existing `dist/` files.
- An HTTP smoke check against a temporary local port passed: health returned `200` and the expected JSON; `/graphql` returned `404`. The temporary server was closed afterward.
- Later-stage source files and requests are still present; removing imports from the router does not remove those files from the compiler or commit snapshot.
- `graphql` and `graphql-http` remain installed. Decide whether to retain them as prepared dependencies or introduce them with stage 2; the previously proposed minimal stage 1 introduces them later.
- `.env.example` still has blank values; populate the safe example settings before considering setup complete.
- Full startup through `src/index.ts` with the copied environment example was not verified; the blank template must be corrected first. The HTTP smoke check constructed `createApp()` directly.

### Questions for revision

- Why does importing `app.ts` not open a port?
- Which file decides the port, and which file starts listening?
- What does the health endpoint actually prove?
- Why do we need zod when TypeScript strict mode is enabled?
- How do `include`, `rootDir`, and `outDir` differ?
- Why is a GraphQL package not needed to respond to `/health`?

## Later-stage entries

For each next stage, add the concept, relevant Google Doc section, source functions, saved Requestly operation, expected result, observed verification, and unresolved limitations. Keep explanatory comments with their corresponding code.

Subscriptions, request context, DataLoader, and further architecture work remain deferred lessons. The current `subscribe: () => {}` is an experiment, not a functioning event stream.
