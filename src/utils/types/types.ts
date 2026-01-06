export type HelloQueryParam = {
  name: string;
};

export type User = { id: string; name: string; email: string | null };

export type UserRecords = Record<string, User>;
