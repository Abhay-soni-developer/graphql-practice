import UsersCollection from "../../utils/data.js";
import type { User } from "../../utils/index.js";

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
