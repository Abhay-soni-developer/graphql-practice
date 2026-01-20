# GraphQL Practice

## Agenda

Learn GraphQL incrementally through small working examples, saved Requestly requests, and concise [revision notes](./LEARNING_LOG.md). Cover schema construction, resolvers, arguments, variables, object types, lists, nullability, aliases, fragments, and mutations.

**Current stage: SDL post CRUD with a computed summary field.** The API exposes health, greetings, version, user lookup/listing, and `createUser(name:, email:)`. Saved examples cover variables, aliases, fragments, and mutations. Data is stored in memory and resets when the server restarts. HTTP and WebSocket operations share `/graphql`; shutdown signals close the server and WebSocket connections. `sendMessage(text:, from:, to:)` publishes to the recipient channel; `subscribeChannel(consumerId:)` streams future events to its active subscribers.

This is a guided rebuild of earlier practice code. Reconstructed Git author dates organize the learning sequence; they do not represent original implementation dates. Committer dates record the rebuild commits' actual creation.

## Run the project

Use Node.js 20 or newer. From the repository root:

```bash
npm ci
cp .env.example .env.development
```

Keep an existing `.env.development` rather than overwriting it. The example intentionally lists keys only; fill the local file before running:

```dotenv
APP_NAME=graphql-practice
APP_ENV=development
PORT=3000
```

```bash
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run TypeScript with automatic restarts |
| `npx tsc --noEmit` | Check types without generating files |
| `npm run build` | Compile source into `dist/` |
| `npm start` | Run the compiled app; build first |

Configuration loads `.env.<NODE_ENV>`, defaulting to development. Existing process environment values take precedence. No database is required.

### Try the endpoints

- **Health:** `GET http://localhost:3000/health` returns `status: "OK"`.
- **GraphQL:** `POST http://localhost:3000/graphql` with `Content-Type: application/json`:

```json
{ "query": "query Greeting($name: String!) { hello(name: $name) }", "variables": { "name": "Abhay" } }
```

Expected response:

```json
{ "data": { "hello": "Hello, Abhay! from explicit resolver" } }
```

Change the port in your requests if needed. Open the local `api-requests/` project in Requestly and use `health`, `helloWithName`, and `welcome-Variables`. The missing-argument and wrong-type examples intentionally return GraphQL errors.

Fetch a user with the `getUser` or `getUser-Variable` Requestly request:

```json
{ "query": "query GetUser($id: ID!) { user(id: $id) { id name email greeting } }", "variables": { "id": "1" } }
```

The user resolver returns the parent object; ordinary fields read its properties and the explicit `greeting` resolver computes `"Welcome ! Abhay Soni"`. The `getVersion` request demonstrates default root resolution. Use `getUsersList` for the list and the saved alias/fragment requests for query composition.

Create a user with the `createUser-Mutation` Requestly example:

```graphql
mutation CreateUser {
  createUser(name: "Practice User", email: "practice@example.com") {
    id
    name
    email
    greeting
  }
}
```

The response contains a generated ID; use it in a lookup or fetch `users` to see the stored record. Email may be omitted or null; name is required. GraphQL string validation does not reject blank names or validate email format.

For manual message-stream testing, use the saved `sendMessage` mutation and follow the [browser subscription guide](./api-requests/SUBSCRIPTIONS.md). The saved `subscribeToConsumerChannel` operation is a reference for a WebSocket-capable client; an ordinary HTTP request does not start this stream.

### SDL endpoint

`POST http://localhost:3000/post-gql` exposes a separate schema constructed with `buildSchema` from SDL. Select `summary` on a post to compute a description from its existing fields through an explicitly attached field resolver. Its root functions delegate to the post service for lookup, author filtering, pagination, creation, updates, and soft deletion. `createPost` requires a `post` input containing `title` and `content`; `authorId` is a separate argument. Data resets on restart. Ownership checks compare caller-supplied IDs; authentication is a later exercise.

```json
{ "query": "{ __typename }" }
```

Use the saved `createNewPost-Flatly_at_the_Top` and `createNewPost-using_Input_Defined_At_Backend` requests to compare separate variables with an input-object variable. Run creation before `getPostByIdOrAuthor` to see author `101` results. `updatePost` and `Delete Post` target seed post `1`; run update before deletion, or restart to restore seed data.

Expected: `{ "data": { "__typename": "Query" } }`. The existing `/graphql` API remains available. `.graphqlrc.yml` points editor tooling to the two schemas independently; it does not configure server routes.

## Libraries

| Library | Purpose |
| --- | --- |
| `graphql` | Define types/schema, parse and validate operations, execute resolvers |
| `graphql-http` | Connect GraphQL execution to HTTP using its Express handler |
| `express` | HTTP application, middleware, and routing |
| `ws` | WebSocket connections attached to the shared HTTP server |
| `graphql-ws` | GraphQL protocol and execution over WebSocket |
| `dotenv` | Load environment-file settings |
| `zod` | Validate runtime configuration |
| `typescript` | Type-check and compile source |
| `tsx` | Execute TypeScript and watch for changes during development |
| `cross-env` | Set environment variables consistently across operating systems |
| `@types/node`, `@types/express`, `@types/ws` | TypeScript declarations for Node.js, Express, and WebSocket connections |

## Folder architecture

The active stage uses the following files. Other untracked exercises in a local working copy belong to later stages.

```text
.
├── src/
│   ├── index.ts                 # Share HTTP/WebSocket server, start listening, handle errors
│   ├── app.ts                   # Assemble Express middleware and routes
│   ├── config.ts                # Load and validate environment settings
│   ├── shutdownHandler.ts       # Close HTTP/WebSocket resources on termination
│   ├── routes/
│   │   ├── index.ts             # Mount /health, /graphql, and /post-gql
│   │   └── health.ts            # Health response handler
│   ├── graphql/
│   │   ├── schema.ts            # Compose Query/Mutation roots and feature fields
│   │   └── root-value.ts        # Root values and alternate hello example
│   ├── modules/user/
│   │   ├── user.schema.ts       # User type, queries, and creation mutation
│   │   ├── user.resolver.ts     # Query/mutation delegation and computed greeting
│   │   ├── user.service.ts      # User lookup, listing, and creation
│   │   └── user.type.ts         # User, records, and mutation argument types
│   ├── modules/post/
│   │   ├── index.ts             # Export the post schema and root value
│   │   ├── post.schema.ts       # Embedded SDL: Post, inputs, interface, operation roots
│   │   ├── post.rootValue.ts    # Map SDL root fields to resolver functions
│   │   ├── post.resolver.ts     # Delegate GraphQL arguments to services
│   │   ├── post.service.ts      # CRUD, ownership checks, pagination, soft deletion
│   │   ├── post.data.ts         # Seeded in-memory post records
│   │   └── post.type.ts         # Internal post and input TypeScript types
│   ├── modules/message/
│   │   ├── message.schema.ts    # Message type, creation mutation, subscription field
│   │   ├── message.resolver.ts  # Delegate message creation to the service
│   │   ├── message.service.ts   # Emit events and manage per-subscriber queues
│   │   └── message.type.ts      # Message and channel argument types
│   └── utils/
│       ├── index.ts             # Shared type and data exports
│       ├── data.ts              # Seed records and in-memory user Map
│       └── types/types.ts       # Greeting argument type; user types live in their module
├── api-requests/
│   ├── __requestly.json         # Requestly local-project configuration
│   ├── apis/                   # Collections and saved requests
│   ├── SUBSCRIPTIONS.md        # Browser/WebSocket manual testing steps
│   ├── environments/           # API-client variables, separate from server .env
│   ├── AGENTS.md               # Requestly-generated file-format instructions
│   ├── PROJECT.md              # Requestly project context
│   ├── .gitignore              # Requestly-specific exclusions
│   └── README.md               # API-client setup and usage guide
├── package.json                # Dependencies and scripts
├── package-lock.json           # Exact dependency resolutions
├── .graphqlrc.yml              # Editor schema/project configuration
├── tsconfig.json               # Strict TypeScript, ESM/NodeNext, src → dist
├── .env.example                # Public configuration keys; fill values locally
├── .gitignore                  # Exclude local environment, dependencies, output
├── agents.md                   # Project coding conventions
├── README.md                   # Setup, libraries, and architecture
└── LEARNING_LOG.md              # Covered concepts with code and theory links
```

Requestly request folders contain metadata, headers, bodies or GraphQL queries, parameters, and optional scripts. Manage their generated files through Requestly. `node_modules/` and `dist/` are generated and are not committed.
