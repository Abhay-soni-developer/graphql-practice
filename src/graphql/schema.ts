import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";
import { userMutations, userQueries } from "../modules/user/user.schema.js";

// Here, we're constructing GraphQL types through JavaScript objects.
const RootQueryType = new GraphQLObjectType({
  name: "Query", // object name, useful for referencing
  fields: {
    hello: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      // explicit resolver , graphql engineer first choice
      // rootValue becomes parent in case it is provided
      resolve: (rootValue, args, _context, _info) => {
        const { name } = args;
        // explicit resolver can call rootValue if provided
        // console.log("from rootValue :: ", rootValue.hello(args));
        console.log(`Received query with name: ${name}`);
        return `Hello, ${name}! from explicit resolver`;
      },
    },
    // User Operations
    ...userQueries,
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...userMutations,
  },
});

const schema = new GraphQLSchema({
  // this is the root query, which anchors all entry-point query fields.
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
