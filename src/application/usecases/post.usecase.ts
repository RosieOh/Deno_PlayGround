import type { IPostRepository } from "../../domain/interfaces/post.repository.ts";
import type { CreatePostDto, UpdatePostDto, PostListResponse } from "../dto/post.dto.ts";
import type { PostWithAuthor } from "../../domain/entities/post.entity.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export class PostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async createPost(dto: CreatePostDto, authorId: string): Promise<PostWithAuthor> {
    const post = await this.postRepository.create({
      title: dto.title,
      content: dto.content,
      authorId,
    });

    const postWithAuthor = await this.postRepository.findByIdWithAuthor(post.id);
    if (!postWithAuthor) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    return postWithAuthor;
  }

  async getPostById(id: string): Promise<PostWithAuthor> {
    const post = await this.postRepository.findByIdWithAuthor(id);
    if (!post) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }
    return post;
  }

  async getPosts(limit = 10, offset = 0): Promise<PostListResponse> {
    const [posts, total] = await Promise.all([
      this.postRepository.findAll({ limit, offset }),
      this.postRepository.count(),
    ]);

    return {
      data: posts,
      total,
      limit,
      offset,
    };
  }

  async updatePost(id: string, dto: UpdatePostDto, userId: string): Promise<PostWithAuthor> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    if (post.authorId !== userId) {
      throw AppError.forbidden("본인의 게시글만 수정할 수 있습니다");
    }

    await this.postRepository.update(id, dto);

    const updatedPost = await this.postRepository.findByIdWithAuthor(id);
    if (!updatedPost) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    return updatedPost;
  }

  async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    if (post.authorId !== userId) {
      throw AppError.forbidden("본인의 게시글만 삭제할 수 있습니다");
    }

    await this.postRepository.delete(id);
  }
}
