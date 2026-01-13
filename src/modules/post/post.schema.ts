import { buildSchema } from "graphql";

// /* GraphQL */  this comment is important to indicate for editor and extension
// that below string is graphql
const schema = buildSchema(/* GraphQL */ `
  interface Timestamped {
    createdAt: String!
    updatedAt: String!
  }

  # Post implements the Timestamped interface contract
  type Post implements Timestamped {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input Pagination {
    from: Int!
    to: Int!
  }

  type Query {
    post(postId: ID!): Post
    postByAuthor(authorId: ID!): [Post!]!
    posts(pagination: Pagination): [Post!]!
  }

  # input define an incoming request arguemnt type
  input CreatePostRequest {
    title: String!
    content: String!
  }

  input UpdatedPostContent {
    title: String!
    content: String!
  }

  type Mutation {
    # this should come from context, we would do that in later exercise
    # when learning about context
    createPost(authorId: ID!, post: CreatePostRequest): Post!
    updatePost(
      id: ID!
      authorId: ID!
      updatedPostContent: UpdatedPostContent!
    ): Post
    deletePost(id: ID!, authorId: ID!): Boolean!
  }
`);

const postSchema = schema;
export default postSchema;
