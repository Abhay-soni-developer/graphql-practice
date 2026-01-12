import EventEmitter from "node:events";
import type { SendMessageRequest, Message } from "./message.type.js";

const eventEmitter = new EventEmitter();

export function sendMessage(message: Message): Message {
  eventEmitter.emit(message.to, message);
  return message;
}
export function createMessage({ text, from, to }: SendMessageRequest): Message {
  const message = {
    id: crypto.randomUUID(),
    text,
    from,
    to,
    timestamp: Date.now().toString(),
  };

  return message;
}

export function subscribeToAConsumerChannel(
  consumerId: string,
): AsyncIterableIterator<Message> {
  const queue: Message[] = []; // this queue will contain the messages still not consumed by consumer
  const waiting: Array<(val: IteratorResult<Message, undefined>) => void> = []; // cb waiting for a message to consume
  let isClosed = false; // status indicating if this consumer is active or gone

  function recieveMessage(message: Message) {
    if (isClosed) {
      return;
    }

    const resolve = waiting.shift();

    if (resolve) {
      resolve({ done: false, value: message });
    } else {
      queue.push(message);
    }
  }

  function closeSubscription(): IteratorReturnResult<undefined> {
    isClosed = true;
    eventEmitter.off(consumerId, recieveMessage);
    queue.length = 0; // empty the message queue

    // clear the waiting array and process all the resolver in it
    for (let resolve of waiting.splice(0)) {
      resolve({ done: true, value: undefined });
    }

    return { done: true, value: undefined };
  }

  eventEmitter.on(consumerId, recieveMessage);

  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<Message> {
      return this;
    },

    next: (): Promise<IteratorResult<Message, undefined>> => {
      if (isClosed === true) {
        return Promise.resolve({ done: true, value: undefined });
      }

      const message = queue.shift();

      if (message) {
        return Promise.resolve({ done: false, value: message });
      }

      return new Promise<IteratorResult<Message, undefined>>((resolve) => {
        waiting.push(resolve);
      });
    },

    return: () => Promise.resolve(closeSubscription()),
  };
}
