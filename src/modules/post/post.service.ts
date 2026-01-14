import postRepository from "./post.data.js";
import type {
  CreatePostRequest,
  Pagination,
  Post,
  UpdatePostParam,
} from "./post.type.js";

export async function getPostById(postId: string): Promise<Post | null> {
  const post = postRepository.find((savePost) => {
    return savePost.id === postId;
  });

  if (!post || post.isDeleted === true) return null;
  return post;
}

export function postByAuthor(authorId: string): Post[] {
  const filteredPosts = postRepository.filter((post: Post) => {
    return post.authorId === authorId && post.isDeleted === false;
  });
  return filteredPosts;
}

// this implementation still treats from as a raw repository
// index and then skips deleted posts while gathering results.
export function posts(pagination?: Pagination | null): Post[] {
  pagination = pagination || { from: 0, to: 5 };
  let { from, to } = pagination;

  if (from < 0 || to < 0) {
    throw new RangeError("from and to can not be negative");
  }

  if (to < from) {
    throw new RangeError("to must be greater than or equal to from");
  }

  if (to > postRepository.length) to = postRepository.length;

  const filteredPost: Post[] = [];
  let pointer = from;
  while (filteredPost.length !== to - from && pointer < postRepository.length) {
    if ((postRepository[pointer] as Post).isDeleted === false) {
      filteredPost.push(postRepository[pointer] as Post);
    }
    pointer++;
  }
  return filteredPost;
}

export function createPost(authorId: string, post: CreatePostRequest): Post {
  const newPost = {
    ...post,
    id: crypto.randomUUID(),
    authorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
  };

  return newPost;
}

export async function createAndSavePost(
  authorId: string,
  newPostContent: CreatePostRequest,
): Promise<Post> {
  const post = await createPost(authorId, newPostContent);
  await savePost(post, true);
  return post;
}

export async function savePost(post: Post, isNewPost: boolean): Promise<true> {
  if (isNewPost) {
    postRepository.push(post);
    return true;
  } else {
    const idx = postRepository.findIndex((savePost) => savePost.id === post.id);
    if (idx === -1 || postRepository[idx]?.isDeleted === true)
      throw new Error("this post is not found");
    postRepository[idx] = post;
    return true;
  }
}

export function generatePostSummary(post: Post): string {
  return `post by ${post.authorId} with title ${post.title} at ${post.createdAt} last modified at ${post.updatedAt}`;
}

export async function updatePost(
  postId: string,
  authorId: string,
  updatedPostContent: UpdatePostParam,
): Promise<Post> {
  const savedPost = (await getPostById(postId)) as Post | null;

  if (!savedPost || (savedPost && savedPost.isDeleted === true)) {
    throw new Error("post with this id does not exist");
  }

  if (savedPost.authorId !== authorId) {
    throw new Error("you can not modify someone else post");
  }

  const post = { ...savedPost };
  post.title = updatedPostContent.title;
  post.content = updatedPostContent.content;
  post.updatedAt = new Date().toISOString();

  await savePost(post, false);

  return post;
}

export async function deletePost(
  postId: string,
  authorId: string,
): Promise<boolean> {
  const post = await getPostById(postId);
  console.log(post);
  if (!post) return true;

  if (authorId !== post.authorId) {
    throw new Error("you are not authorized to take this action");
  }

  if (post.isDeleted === false) {
    const modifiedPost = { ...post };
    modifiedPost.isDeleted = true;
    await savePost(modifiedPost, false);
  }

  return true;
}
