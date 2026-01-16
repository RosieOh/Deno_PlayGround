import type { Comment, CommentWithAuthor } from "../entities/comment.entity.ts";

export interface ICommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<CommentWithAuthor[]>;
  findByAuthorId(authorId: string): Promise<Comment[]>;
  create(comment: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment>;
  update(id: string, data: Partial<Pick<Comment, "content">>): Promise<Comment | null>;
  delete(id: string): Promise<boolean>;
  countByPostId(postId: string): Promise<number>;
}
