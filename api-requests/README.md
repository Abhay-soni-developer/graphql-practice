# GraphQL Practice — Requestly

Saved requests for manually exploring the GraphQL Practice API. This folder is a Requestly local project; requests are stored on disk alongside the application code.

## Prerequisites

- Node.js 20 or newer and npm.
- [Requestly desktop app](https://requestly.com/).
- A local copy of this repository.

## 1. Start the API

Run these commands from the repository root, not this folder:

```bash
npm ci
```

If `.env.development` does not exist, copy the example:

```bash
cp .env.example .env.development
```

Set these values in `.env.development` (the example currently needs its port changed):

```dotenv
APP_NAME=graphql-practice
APP_ENV=development
PORT=3000
```

The current in-memory examples do not require a database, Redis, or authentication configuration.

Start the development server and leave the terminal running:

```bash
npm run dev
```

| Endpoint | URL |
| --- | --- |
| Health check | `http://localhost:3000/health` |
| GraphQL | `http://localhost:3000/graphql` |

## 2. Open this local project in Requestly

1. Open the Requestly desktop app and its API Client.
2. Use the project switcher at the top-left. If this local project is already registered, select it.
3. Otherwise, use the local-project flow to select the existing `api-requests` folder in this repository. Use the option to open an existing local project if your version provides one. The selected folder should contain `__requestly.json`.
4. Name the project **GraphQL Practice** when prompted.
5. Confirm the **Graphql Practice** collection appears.

Select `api-requests` itself, rather than its `apis` subfolder. These are already local-project files, so you do not need to import every JSON file separately.

See [Requestly's local-project guide](https://requestly.com/features/local-projects/) for the current setup flow.

## 3. Run the requests

Open a request in the collection, confirm its URL, and click **Send**. Some saved URLs omit the scheme; use the full `http://localhost:3000/...` URL if needed.

Suggested order:

| Request | What to check |
| --- | --- |
| `health` | A response containing `status: "OK"` |
| `welcome-Variables` | A greeting using the supplied name variable |
| `getUser-Variable` | A user fetched with ID `"1"` |
| `getUsersList` | The current users |
| `graphql-alias` / `graphql-http-alias-request` | Aliased fields in the response |
| `graphql-fragments-variables` / `graphql-inline-fragments` | Reusable or inline field selections |
| `createUser-Mutation` | A new user with a generated ID |
| `graphql - missing arguments` / `graphql - wrong type` | Expected GraphQL validation errors |

Inspect both `data` and `errors` in GraphQL responses. An HTTP success status alone does not mean every GraphQL field succeeded.

After creating a user, send `getUsersList` again to see it. Storage is in memory: restarting the server, including a development watcher restart, resets newly created users.

### A minimal working GraphQL request

For an HTTP request, use **POST**, URL `http://localhost:3000/graphql`, header `Content-Type: application/json`, and this JSON body:

```json
{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email greeting } }",
  "variables": { "id": "1" }
}
```

For Requestly's GraphQL request editor, put the operation in the **Query** editor:

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    greeting
  }
}
```

Put the variables in the **Variables** editor:

```json
{ "id": "1" }
```

## Changing the server address

Saved requests currently target `localhost:3000`; the global environment has no predefined variables. If you change the server port, update request URLs to match.

For a reusable setup, define `baseUrl` as `http://localhost:3000` in a Requestly environment, select that environment, and change URLs to `{{baseUrl}}/graphql` or `{{baseUrl}}/health`. Requestly environments and the server's `.env.development` are separate configurations.

## Folder contents

```text
api-requests/
├── __requestly.json     # Local-project configuration
├── apis/               # Collection, requests, and request scripts
├── environments/       # Requestly variables
├── AGENTS.md           # Requestly-generated file-format guidance
├── PROJECT.md          # Project-specific context
└── README.md           # This guide
```

Save request changes in Requestly, then review the changed files in Git. Prefer the app for renaming or moving requests; preserve generated IDs and configuration versions. Keep literal credentials out of committed request and environment files.

These requests are manual learning examples. They do not replace automated service or resolver tests.

## Troubleshooting

- **Connection refused:** start the API with `npm run dev` and check that the configured port matches the request URL.
- **Collection missing:** check that Requestly opened this repository's `api-requests` folder and the correct local project.
- **GraphQL syntax error in `welcomeQuery` or `getUser`:** these saved HTTP examples currently contain extra escaping around inline string arguments. In the Requestly JSON body editor, use `"query": "{ hello(name: \"Abhay\") }"`, or use the variables-based example above to avoid inline quoting.
- **Missing argument or wrong-type error:** expected for the two deliberately invalid requests; otherwise, check the query and variables.
- **User not found:** use a seeded ID such as `"1"`, or create a user again if the server restarted.
- **Mutation result disappeared:** new users last only for the current server process.
