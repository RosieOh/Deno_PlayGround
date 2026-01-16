import type { ICommentRepository } from "../../domain/interfaces/comment.repository.ts";
import type { IPostRepository } from "../../domain/interfaces/post.repository.ts";
import type { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto.ts";
import type { CommentWithAuthor } from "../../domain/entities/comment.entity.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export class CommentUseCase {
  constructor(
    private commentRepository: ICommentRepository,
    private postRepository: IPostRepository
  ) {}

  async createComment(postId: string, dto: CreateCommentDto, authorId: string): Promise<CommentWithAuthor> {
    // 게시글 존재 확인
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    const comment = await this.commentRepository.create({
      content: dto.content,
      postId,
      authorId,
    });

    const comments = await this.commentRepository.findByPostId(postId);
    const createdComment = comments.find((c) => c.id === comment.id);
    if (!createdComment) {
      throw AppError.notFound("댓글을 찾을 수 없습니다");
    }

    return createdComment;
  }

  async getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
    // 게시글 존재 확인
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw AppError.notFound("게시글을 찾을 수 없습니다");
    }

    return this.commentRepository.findByPostId(postId);
  }

  async updateComment(commentId: string, dto: UpdateCommentDto, userId: string): Promise<CommentWithAuthor> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw AppError.notFound("댓글을 찾을 수 없습니다");
    }

    if (comment.authorId !== userId) {
      throw AppError.forbidden("본인의 댓글만 수정할 수 있습니다");
    }

    await this.commentRepository.update(commentId, dto);

    const comments = await this.commentRepository.findByPostId(comment.postId);
    const updatedComment = comments.find((c) => c.id === commentId);
    if (!updatedComment) {
      throw AppError.notFound("댓글을 찾을 수 없습니다");
    }

    return updatedComment;
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw AppError.notFound("댓글을 찾을 수 없습니다");
    }

    if (comment.authorId !== userId) {
      throw AppError.forbidden("본인의 댓글만 삭제할 수 있습니다");
    }

    await this.commentRepository.delete(commentId);
  }
}
