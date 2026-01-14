import {
  resolveCreatePost,
  resolveDeletePost,
  resolveGetPostById,
  resolvePostByAuthor,
  resolvePosts,
  resolveUpdatePost,
} from "./post.resolver.js";

const postRootValue = {
  post: resolveGetPostById,
  postByAuthor: resolvePostByAuthor,
  posts: resolvePosts,
  createPost: resolveCreatePost,
  updatePost: resolveUpdatePost,
  deletePost: resolveDeletePost,
};

export default postRootValue;
