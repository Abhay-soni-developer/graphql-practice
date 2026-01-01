# GraphQL Practice

A TypeScript learning project that connects GraphQL concepts to readable code, Requestly requests, and revision notes. The application is being rebuilt in small, verifiable learning stages.

## Current stage

**Stage 1: Express application setup and health endpoint.**

The active HTTP application mounts `GET /health`. It does not currently mount `/graphql`. Files and saved requests from later GraphQL exercises are still present for reference; their presence does not mean those features are available through HTTP at this stage.

This is a guided reconstruction of an earlier practice project. Learning-stage numbers describe the teaching sequence. Any reconstructed author dates used in Git history are organizational dates, not evidence of the original implementation dates; committer dates record when the reconstructed commits were created.

## Learning references

- [My GraphQL notes — Introduction](https://docs.google.com/document/d/1NNcCuvllHYrxcwX9Y2obH-7_5nDUmfjjpWODbA6RLnQ/edit?tab=t.0): motivation, schema contracts, execution flow, fields, resolvers, arguments, and nullability.
- [Learning log](./LEARNING_LOG.md): stage explanations, library responsibilities, verification, and deferred topics.
- [Requestly setup](./api-requests/README.md): how to open the local API project and run saved requests. Its GraphQL instructions apply to later stages.

The Google Doc provides the theory; source files demonstrate the implementation; Requestly provides manual exercises. Later-stage notes are kept separate from verified stage 1 behavior.

## Prerequisites

- Node.js 20 or newer and npm. The current review used Node.js 24.
- Requestly desktop app for the saved manual requests, or another HTTP client for `/health`.

## Setup

Run from the repository root:

```bash
npm ci
cp .env.example .env.development
```

If `.env.development` already exists, keep it instead of overwriting it. Edit it to contain:

```dotenv
APP_NAME=graphql-practice
APP_ENV=development
PORT=3000
```

The committed `.env.example` currently contains blank values: replace them before starting the application. Defaults apply to missing settings, not blank strings. Database, Redis, and authentication settings are not needed for stage 1.

`config.ts` loads `.env.<NODE_ENV>`, defaulting to `.env.development`. Existing process environment variables take precedence. `NODE_ENV` accepts `development`, `test`, or `production`; `PORT` must be an integer from 1 to 65535.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Set `NODE_ENV=development` and run TypeScript with automatic restarts |
| `npx tsc --noEmit` | Check types without generating output |
| `npm run build` | Compile source from `src/` into `dist/` |
| `npm start` | Run the compiled `dist/index.js`; build first |

This repository uses ES modules and TypeScript's NodeNext resolution. Relative source imports use `.js` extensions so the emitted JavaScript imports work in Node.js.

## Run stage 1

```bash
npm run dev
```

Send this request in Requestly, or use curl:

```bash
curl http://localhost:3000/health
```

Expected HTTP status: `200`.

```json
{
  "status": "OK",
  "message": "Hello from GraphQL Practice!"
}
```

Change the URL if you configure a different port. The health response confirms HTTP routing works; it does not check a database or execute GraphQL. A request to `/graphql` currently returns `404`.

## Project structure

```text
graphql-practice/
├── package.json                 # Dependencies and development/build/start commands
├── package-lock.json            # Resolved dependency versions for reproducible installs
├── tsconfig.json                # Strict TypeScript and NodeNext build configuration
├── .gitignore                   # Excludes secrets, dependencies, build output, OS files
├── .env.example                 # Public environment template; currently needs values
├── agents.md                    # Project coding conventions
├── README.md                    # Setup, active scope, and navigation
├── LEARNING_LOG.md               # Concepts, library roles, and stage verification
├── src/
│   ├── index.ts                 # Create the app, listen, and report server errors
│   ├── app.ts                   # Assemble Express middleware and routes
│   ├── config.ts                # Load and validate environment settings
│   ├── routes/
│   │   ├── index.ts             # Mount the active routes; health only in stage 1
│   │   └── health.ts            # GET /health handler
│   ├── graphql/                 # Later-stage code; not mounted in stage 1
│   │   ├── index.ts             # Re-export schema and root value
│   │   ├── schema.ts            # Compose root object types and GraphQLSchema
│   │   ├── root-value.ts        # Root data and default field-resolution example
│   │   └── context.ts           # Empty placeholder for a future context lesson
│   ├── modules/
│   │   ├── user/                # Later-stage user feature
│   │   │   ├── user.schema.ts   # User object type and query/mutation field definitions
│   │   │   ├── user.resolver.ts # GraphQL callbacks and computed greeting
│   │   │   └── user.service.ts  # User lookup, listing, and creation using memory
│   │   └── message/
│   │       ├── message.schema.ts   # Message type and unfinished subscription
│   │       └── message.resolver.ts # Empty placeholder
│   └── utils/
│       ├── index.ts             # Re-export shared data and types
│       ├── data.ts              # Seed records and shared in-memory user Map
│       └── types/
│           ├── index.ts         # Type export barrel
│           └── types.ts         # User and operation argument types
└── api-requests/
    ├── __requestly.json         # Requestly-managed local project configuration
    ├── AGENTS.md                # Requestly-generated editing rules
    ├── PROJECT.md               # Local project context
    ├── README.md                # Requestly setup and manual usage
    ├── .gitignore               # Requestly-specific exclusions
    ├── environments/            # Requestly variables; separate from server .env files
    └── apis/Graphql Practice/   # Health request and retained later-stage requests
```

Requestly stores each collection/request using generated files. `__metadata.json` records identity and URL, `__headers.json` records headers, `__body.json` stores HTTP bodies, and `__query.json` stores GraphQL operations and variables. HTTP requests may also have parameter files and pre/post-request scripts. Use Requestly to manage them; retain its generated IDs.

`node_modules/` contains installed dependencies and `dist/` contains generated output. Neither belongs in commits.

## Learning roadmap

| Stage | Focus | Manual verification |
| --- | --- | --- |
| 1 | Express, configuration, TypeScript, application versus startup | Health request |
| 2 | GraphQL HTTP integration, object types, schema, basic query | Basic hello query |
| 3 | Required arguments, variables, named operations, invalid requests | Greeting/user variables and validation examples |
| 4 | Explicit versus default root resolution | Hello versus version |
| 5 | User objects and nested parent values | User lookup with greeting |
| 6 | Lists, nullable fields, and missing-user errors | User list and failure examples |
| 7 | Aliases, named fragments, inline fragments | Existing alias/fragment requests |
| 8 | User creation mutation and response selection | Create, then fetch/list |
| 9 | Feature-based schema, resolver, and service extraction | Re-run the operations after refactoring |

This table is a rebuild plan, not a claim that these stages already exist as separate commits. Each future completed stage should connect code, a Requestly exercise, and a learning-log entry. Working subscriptions and advanced context/DataLoader topics are deferred.

## Before the stage 1 commit

- Preserve the complete project before removing later-stage code.
- Decide whether to archive the later-stage source, GraphQL packages, and Requestly operations outside the stage 1 snapshot. They are still present in this working tree.
- Populate `.env.example` with the documented safe values.
- Verify type-checking, a fresh build, and the health request.
- Review exactly what is staged; keep real environment files and credentials out.

There is no automated test suite at this stage. Requestly requests are manual verification examples.
