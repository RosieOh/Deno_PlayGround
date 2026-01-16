export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface PostListResponse {
  data: Array<{
    id: string;
    title: string;
    content: string;
    author: { id: string; username: string };
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}
