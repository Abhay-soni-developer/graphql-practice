import { createMessage, sendMessage } from "./message.service.js";
import type { SendMessageRequest, Message } from "./message.type.js";

export async function resolveSendMessage(
  _: unknown,
  args: SendMessageRequest,
): Promise<Message> {
  const message = createMessage(args);
  sendMessage(message);
  return message;
}
