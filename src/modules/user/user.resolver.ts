import type { GraphQLResolveInfo } from "graphql";
import { createNewUser, getUser, getUsersList } from "./user.service.js";
import type rootValue from "../../graphql/root-value.js";
import type { User, CreateUserRequest } from "./user.type.js";

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
export function resolveUserGreeting(parent: User): string {
  console.log("user greeting field resolver ran");
  return `Welcome ! ${parent.name}`;
}

// Users List Resolver
export function resolveUsers(): Promise<User[]> {
  console.log("users list requested");
  return getUsersList();
}
export function resolveCreateUser(
  _rootValue: unknown,
  args: CreateUserRequest,
): Promise<User> {
  console.log("create User resolver ran");
  const { name, email = null } = args;
  return createNewUser(name, email);
}
