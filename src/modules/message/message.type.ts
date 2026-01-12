export type Message = {
  id: string;
  text: string;
  timestamp: string;
  from: string;
  to: string;
};

export type SendMessageRequest = {
  text: string;
  from: string;
  to: string;
};

export type SubscribeChannelRequest = {
  consumerId: string;
};
