import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import { resolveCreateMessage } from "./message.resolver.js";
import { subscribeToAConsumerChannel } from "./message.service.js";
import type { Message, SubscribeChannelRequest } from "./message.type.js";

export const MessageType = new GraphQLObjectType({
  name: "Message", // object name, useful for referencing
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
    to: { type: new GraphQLNonNull(GraphQLID) },
    from: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const messageMutations = {
  createMessage: {
    type: MessageType,
    args: {
      text: { type: new GraphQLNonNull(GraphQLString) },
      from: { type: new GraphQLNonNull(GraphQLID) },
      to: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: resolveCreateMessage,
  },
};

export const messageSubscriptions = {
  sendMessage: {
    type: MessageType,
    args: {
      consumerId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (message: Message) => message,
    subscribe: (_rootValue: unknown, args: SubscribeChannelRequest) =>
      subscribeToAConsumerChannel(args.consumerId),
  },
};
