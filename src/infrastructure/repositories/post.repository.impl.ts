import type { Post, PostWithAuthor } from "../../domain/entities/post.entity.ts";
import type { IPostRepository } from "../../domain/interfaces/post.repository.ts";
import type { IUserRepository } from "../../domain/interfaces/user.repository.ts";
import type { ICommentRepository } from "../../domain/interfaces/comment.repository.ts";

export class InMemoryPostRepository implements IPostRepository {
  private posts: Map<string, Post> = new Map();
  private nextId = 1;

  constructor(
    private userRepository: IUserRepository,
    private commentRepository: ICommentRepository
  ) {}

  async findById(id: string): Promise<Post | null> {
    return this.posts.get(id) ?? null;
  }

  async findByIdWithAuthor(id: string): Promise<PostWithAuthor | null> {
    const post = this.posts.get(id);
    if (!post) return null;

    const author = await this.userRepository.findById(post.authorId);
    const commentCount = await this.commentRepository.countByPostId(post.id);

    return {
      ...post,
      author: {
        id: author?.id ?? "",
        username: author?.username ?? "Unknown",
      },
      commentCount,
    };
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<PostWithAuthor[]> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    const allPosts = Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    const postsWithAuthor: PostWithAuthor[] = [];

    for (const post of allPosts) {
      const author = await this.userRepository.findById(post.authorId);
      const commentCount = await this.commentRepository.countByPostId(post.id);

      postsWithAuthor.push({
        ...post,
        author: {
          id: author?.id ?? "",
          username: author?.username ?? "Unknown",
        },
        commentCount,
      });
    }

    return postsWithAuthor;
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter((p) => p.authorId === authorId);
  }

  async create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const now = new Date();
    const post: Post = {
      id: String(this.nextId++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(post.id, post);
    return post;
  }

  async update(id: string, data: Partial<Pick<Post, "title" | "content">>): Promise<Post | null> {
    const post = this.posts.get(id);
    if (!post) return null;

    const updated: Post = {
      ...post,
      ...data,
      updatedAt: new Date(),
    };
    this.posts.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async count(): Promise<number> {
    return this.posts.size;
  }
}
