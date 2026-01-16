import type { Post, PostWithAuthor } from "../entities/post.entity.ts";

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findByIdWithAuthor(id: string): Promise<PostWithAuthor | null>;
  findAll(options?: { limit?: number; offset?: number }): Promise<PostWithAuthor[]>;
  findByAuthorId(authorId: string): Promise<Post[]>;
  create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  update(id: string, data: Partial<Pick<Post, "title" | "content">>): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
