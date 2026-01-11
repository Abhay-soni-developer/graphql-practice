export type Message = {
  id: string;
  text: string;
  timestamp: string;
  from: string;
  to: string;
};

export type CreateMessageRequest = {
  text: string;
  from: string;
  to: string;
};

export type SubscribeChannelRequest = {
  consumerId: string;
};
