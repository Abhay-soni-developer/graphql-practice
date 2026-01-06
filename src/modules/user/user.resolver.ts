import type { GraphQLResolveInfo } from "graphql";
import { getUser } from "./user.service.js";
import type rootValue from "../../graphql/root-value.js";
import type { User } from "../../utils/index.js";

export function resolveUser(
  _rootValue: typeof rootValue,
  args: { id: string },
  _ctx: unknown,
  _info: GraphQLResolveInfo,
) {
  console.log("user resolver ran");
  return getUser(args.id);
}

// FIELD LEVEL RESOLVER
export function resolveUserGreeting(parent: User) {
  console.log("user greeting field resolver ran");
  return `Welcome ! ${parent.name}`;
}
