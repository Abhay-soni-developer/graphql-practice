import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from "graphql";
import {
  resolveUser,
  resolveUserGreeting,
  resolveUsers,
} from "./user.resolver.js";

export const UserType = new GraphQLObjectType({
  name: "User", // object name, useful for referencing
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    greeting: {
      type: new GraphQLNonNull(GraphQLString),

      // greeting does not exist in parent
      // here we use explicit field level resolver to construct it
      // parent here is not rootValue, but the value returned by Query.user resolver
      resolve: resolveUserGreeting,
    },
  },
});

export const userQueries = {
  user: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    // ROOT LEVEL RESOLVER
    resolve: resolveUser,
  },

  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: resolveUsers,
  },
};
