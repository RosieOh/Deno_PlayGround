export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithAuthor extends Post {
  author: {
    id: string;
    username: string;
  };
  commentCount: number;
}
