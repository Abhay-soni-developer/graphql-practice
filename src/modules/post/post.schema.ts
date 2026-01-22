import { buildSchema, isField, isObjectType } from "graphql";
import { resolvePostSummary } from "./post.resolver.js";
import { readFileSync } from "node:fs";

const grapgQlSchema = readFileSync(
  new URL("./post.schema.graphql", import.meta.url),
  "utf8",
);

// /* GraphQL */  this comment is important to indicate for editor and extension
// that below string is graphql

// Embedded SDL Technique
// const schema = buildSchema(/* GraphQL */ `
//   interface Timestamped {
//     createdAt: String!
//     updatedAt: String!
//   }

//   # Post implements the Timestamped interface contract
//   type Post implements Timestamped {
//     id: ID!
//     title: String!
//     content: String!
//     authorId: ID!
//     summary: String!
//     createdAt: String!
//     updatedAt: String!
//   }

//   input Pagination {
//     from: Int!
//     to: Int!
//   }

//   type Query {
//     post(postId: ID!): Post
//     postByAuthor(authorId: ID!): [Post!]!
//     posts(pagination: Pagination): [Post!]!
//   }

//   # input define an incoming request arguemnt type
//   input CreatePostRequest {
//     title: String!
//     content: String!
//   }

//   input UpdatedPostContent {
//     title: String!
//     content: String!
//   }

//   type Mutation {
//     # this should come from context, we would do that in later exercise
//     # when learning about context
//     createPost(authorId: ID!, post: CreatePostRequest!): Post!
//     updatePost(
//       id: ID!
//       authorId: ID!
//       updatedPostContent: UpdatedPostContent!
//     ): Post
//     deletePost(id: ID!, authorId: ID!): Boolean!
//   }
// `);

// graphql file
const schema = buildSchema(grapgQlSchema);
const Post = schema.getType("Post");
// attaching resolver to computed field
if (isObjectType(Post)) {
  const postFields = Post.getFields();
  const summaryField = postFields["summary"];
  if (isField(summaryField)) {
    summaryField.resolve = resolvePostSummary;
  }
}

const postSchema = schema;
export default postSchema;
