export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    username: string;
  };
}
