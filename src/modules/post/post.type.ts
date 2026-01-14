export type Timestamped = {
  createdAt: string;
  updatedAt: string;
};

export type Deletable = {
  isDeleted: boolean;
};

export type Pagination = {
  from: number;
  to: number;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
} & Timestamped &
  Deletable;

export type CreatePostRequest = {
  title: string;
  content: string;
};

export type UpdatePostParam = {
  title: string;
  content: string;
};

export type UpdatePostRequest = {
  id: string;
  authorId: string;
  updatedPostContent: UpdatePostParam;
};
