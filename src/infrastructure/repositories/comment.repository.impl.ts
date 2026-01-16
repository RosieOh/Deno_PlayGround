import type { Comment, CommentWithAuthor } from "../../domain/entities/comment.entity.ts";
import type { ICommentRepository } from "../../domain/interfaces/comment.repository.ts";
import type { IUserRepository } from "../../domain/interfaces/user.repository.ts";

export class InMemoryCommentRepository implements ICommentRepository {
  private comments: Map<string, Comment> = new Map();
  private nextId = 1;

  constructor(private userRepository: IUserRepository) {}

  async findById(id: string): Promise<Comment | null> {
    return this.comments.get(id) ?? null;
  }

  async findByPostId(postId: string): Promise<CommentWithAuthor[]> {
    const postComments = Array.from(this.comments.values())
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const commentsWithAuthor: CommentWithAuthor[] = [];

    for (const comment of postComments) {
      const author = await this.userRepository.findById(comment.authorId);
      commentsWithAuthor.push({
        ...comment,
        author: {
          id: author?.id ?? "",
          username: author?.username ?? "Unknown",
        },
      });
    }

    return commentsWithAuthor;
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter((c) => c.authorId === authorId);
  }

  async create(data: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment> {
    const now = new Date();
    const comment: Comment = {
      id: String(this.nextId++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.comments.set(comment.id, comment);
    return comment;
  }

  async update(id: string, data: Partial<Pick<Comment, "content">>): Promise<Comment | null> {
    const comment = this.comments.get(id);
    if (!comment) return null;

    const updated: Comment = {
      ...comment,
      ...data,
      updatedAt: new Date(),
    };
    this.comments.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  async countByPostId(postId: string): Promise<number> {
    return Array.from(this.comments.values()).filter((c) => c.postId === postId).length;
  }
}
