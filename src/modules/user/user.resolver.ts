import type { GraphQLResolveInfo } from "graphql";
import { getUser, getUsersList } from "./user.service.js";
import type rootValue from "../../graphql/root-value.js";
import type { User } from "../../utils/index.js";

export function resolveUser(
  _rootValue: typeof rootValue,
  args: { id: string },
  _ctx: unknown,
  _info: GraphQLResolveInfo,
): Promise<User> {
  console.log("user resolver ran");
  return getUser(args.id);
}

// FIELD LEVEL RESOLVER
export function resolveUserGreeting(parent: User): String {
  console.log("user greeting field resolver ran");
  return `Welcome ! ${parent.name}`;
}

// Users List Resolver
export function resolveUsers(): Promise<User[]> {
  console.log("users list requested");
  return getUsersList();
}
