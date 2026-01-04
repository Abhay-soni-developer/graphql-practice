# GraphQL Practice

## Agenda

Learn GraphQL incrementally through small working examples, saved Requestly requests, and concise [revision notes](./LEARNING_LOG.md). Cover schema construction, resolvers, arguments, variables, object types, lists, nullability, aliases, fragments, and mutations.

**Current stage: required arguments and variables.** The API exposes a health endpoint and `hello(name: String!): String!`. Further concepts are added in later stages.

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

## Libraries

| Library | Purpose |
| --- | --- |
| `graphql` | Define types/schema, parse and validate operations, execute resolvers |
| `graphql-http` | Connect GraphQL execution to HTTP using its Express handler |
| `express` | HTTP application, middleware, and routing |
| `dotenv` | Load environment-file settings |
| `zod` | Validate runtime configuration |
| `typescript` | Type-check and compile source |
| `tsx` | Execute TypeScript and watch for changes during development |
| `cross-env` | Set environment variables consistently across operating systems |
| `@types/node`, `@types/express` | TypeScript declarations for Node.js and Express |

## Folder architecture

The active stage uses the following files. Other untracked exercises in a local working copy belong to later stages.

```text
.
├── src/
│   ├── index.ts                 # Start listening and handle server errors
│   ├── app.ts                   # Assemble Express middleware and routes
│   ├── config.ts                # Load and validate environment settings
│   ├── routes/
│   │   ├── index.ts             # Mount /health and /graphql
│   │   └── health.ts            # Health response handler
│   └── graphql/
│       └── schema.ts            # Query object, hello resolver, and GraphQLSchema
├── api-requests/
│   ├── __requestly.json         # Requestly local-project configuration
│   ├── apis/                   # Collections and saved requests
│   ├── environments/           # API-client variables, separate from server .env
│   ├── AGENTS.md               # Requestly-generated file-format instructions
│   ├── PROJECT.md              # Requestly project context
│   ├── .gitignore              # Requestly-specific exclusions
│   └── README.md               # API-client setup and usage guide
├── package.json                # Dependencies and scripts
├── package-lock.json           # Exact dependency resolutions
├── tsconfig.json               # Strict TypeScript, ESM/NodeNext, src → dist
├── .env.example                # Public configuration keys; fill values locally
├── .gitignore                  # Exclude local environment, dependencies, output
├── agents.md                   # Project coding conventions
├── README.md                   # Setup, libraries, and architecture
└── LEARNING_LOG.md              # Covered concepts with code and theory links
```

Requestly request folders contain metadata, headers, bodies or GraphQL queries, parameters, and optional scripts. Manage their generated files through Requestly. `node_modules/` and `dist/` are generated and are not committed.
