import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";

// Here, we're constructing GraphQL types through JavaScript objects.
const RootQueryType = new GraphQLObjectType({
  name: "Query", // object name, useful for referencing
  fields: {
    hello: {
      type: new GraphQLNonNull(GraphQLString),
      // explicit resolver , graphql engine first choice
      // rootValue becomes parent in case it is provided
      resolve: (rootValue, args, _context, _info) => {
        return "Hello, GraphQL!";
      },
    },
  },
});

const schema = new GraphQLSchema({
  // this is the root query, which anchors all entry-point query fields.
  query: RootQueryType,
});

export default schema;
