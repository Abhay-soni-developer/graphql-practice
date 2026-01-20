import {
  createAndSavePost,
  deletePost,
  generatePostSummary,
  getPostById,
  postByAuthor,
  posts,
  updatePost,
} from "./post.service.js";
import type {
  CreatePostRequest,
  Pagination,
  Post,
  UpdatePostRequest,
} from "./post.type.js";

export async function resolveGetPostById({
  postId,
}: {
  postId: string;
}): Promise<Post | null> {
  const post = await getPostById(postId);
  return post;
}

export async function resolvePostByAuthor({
  authorId,
}: {
  authorId: string;
}): Promise<Post[]> {
  return await postByAuthor(authorId);
}

export function resolvePosts(args: { pagination?: Pagination | null }) {
  return posts(args.pagination);
}

// the author id should come from context
export async function resolveCreatePost(args: {
  authorId: string;
  post: CreatePostRequest;
}): Promise<Post> {
  return await createAndSavePost(args.authorId, args.post);
}

export async function resolveUpdatePost(
  updatePostRequest: UpdatePostRequest,
): Promise<Post> {
  return await updatePost(
    updatePostRequest.id,
    // the author id should come from context
    updatePostRequest.authorId,
    updatePostRequest.updatedPostContent,
  );
}

// the author id should come from context
export async function resolveDeletePost(args: {
  id: string;
  authorId: string;
}): Promise<boolean> {
  return await deletePost(args.id, args.authorId);
}

export function resolvePostSummary(post: Post): string {
  return generatePostSummary(post);
}
