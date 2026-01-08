export type User = { id: string; name: string; email: string | null };
export type UserRecords = Record<string, User>;
export type CreateUserRequest = {
  name: string;
  email?: string | null;
};
