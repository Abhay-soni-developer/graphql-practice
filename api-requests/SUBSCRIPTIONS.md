# Test message subscriptions

Start the API with `npm run dev`. Publishing uses HTTP; subscriptions use WebSocket on the same `/graphql` path.

## Listen in the browser

Open `http://localhost:3000/health`, then open that tab's Developer Tools → Console. Paste:

```js
var socket = new WebSocket(
  "ws://localhost:3000/graphql",
  "graphql-transport-ws",
);

socket.onopen = () => {
  socket.send(JSON.stringify({ type: "connection_init" }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Received:", message);

  if (message.type === "connection_ack") {
    socket.send(JSON.stringify({
      id: "channel-11",
      type: "subscribe",
      payload: {
        query: `subscription {
          subscribeChannel(consumerId: "11") {
            id text from to timestamp
          }
        }`,
      },
    }));
  }
};

socket.onerror = (event) => console.error("Socket error:", event);
socket.onclose = (event) => console.log("Closed:", event.code, event.reason);
```

After `connection_ack`, the subscription request is sent. There is no initial message or subscription-level acknowledgement; wait until the subscription is registered before publishing. Messages emitted before registration are not replayed.

## Publish from Requestly

Open `Graphql Practice → sendMessage`, targeting `http://localhost:3000/graphql`. Its variables set `to` to `"11"`, matching the subscribed consumer ID. Send the request after the browser listener is active.

Expect a WebSocket frame with `type: "next"` and the message under `payload.data.subscribeChannel`. The returned message ID should match the mutation response.

The saved `subscribeToConsumerChannel` request contains the subscription operation for reference. It requires a compatible WebSocket client; saving a `ws://` URL alone does not add WebSocket support to an HTTP request editor.

## Verify behavior

1. Open a second browser tab and subscribe to `"11"`; both should receive a new message to `"11"`.
2. Subscribe another tab to `"12"`; it should not receive messages addressed to `"11"`.
3. Cancel one subscription; remaining subscribers should still receive new messages.
4. Omit a required mutation argument or subscription `consumerId`; expect a GraphQL error.
5. Stop the server with Ctrl+C; connected sockets should close.

Cancel the console subscription with:

```js
socket.send(JSON.stringify({ id: "channel-11", type: "complete" }));
socket.close();
```

Only future events in the current Node process are delivered. There is no history, persistence, or authorization; a consumer ID is a routing key, not proof of identity.
