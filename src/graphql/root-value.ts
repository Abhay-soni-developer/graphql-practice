import type { GraphQLResolveInfo } from "graphql";
import type { HelloQueryParam } from "../utils/types/types.js";

const rootValue = {
  // either called when default resolver is not present
  // or explicitly by default Resolver
  hello: (
    args: HelloQueryParam,
    context: unknown,
    info: GraphQLResolveInfo,
  ) => {
    try {
      const { name } = args;
      console.log(
        `rootValue Received query with name: ${name} : ${context} : ${info}`,
      );
      return `Hello, ${name}! from root value`;
    } catch (err) {
      console.log(err);
    }
  },
  // fallback value
  //   hello: "Abhay",
  version: "1.0.0",
};

export type RootValue = typeof rootValue;

export default rootValue;
