import { createMessage } from "./message.service.js";
import type { CreateMessageRequest, Message } from "./message.type.js";

export async function resolveCreateMessage(
  _: unknown,
  args: CreateMessageRequest,
): Promise<Message> {
  return createMessage(args);
}
