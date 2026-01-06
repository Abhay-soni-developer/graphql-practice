import UsersCollection from "../../utils/data.js";

export async function getUser(id: string) {
  const user = UsersCollection.get(id);
  if (!user) {
    throw new Error("user with this id does not exist");
  }
  return user;
}