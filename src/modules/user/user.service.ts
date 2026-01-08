import UsersCollection from "../../utils/data.js";
import type { User } from "./user.type.js";

export async function getUser(id: string): Promise<User> {
  const user = UsersCollection.get(id);
  if (!user) {
    throw new Error("user with this id does not exist");
  }
  return user;
}

export async function getUsersList(): Promise<User[]> {
  return [...UsersCollection.values()];
}

export async function createNewUser(
  name: string,
  email: string | null,
): Promise<User> {
  const id = String(crypto.randomUUID());
  const user = { id, name, email };
  UsersCollection.set(user.id, user);
  return user;
}
