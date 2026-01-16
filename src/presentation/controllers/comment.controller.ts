import type { CommentUseCase } from "../../application/usecases/comment.usecase.ts";
import type { CreateCommentDto, UpdateCommentDto } from "../../application/dto/comment.dto.ts";
import { extractAuthUser } from "../middlewares/auth.middleware.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export class CommentController {
  constructor(private commentUseCase: CommentUseCase) {}

  async createComment(req: Request, params: Record<string, string>): Promise<Response> {
    const authUser = await extractAuthUser(req);
    const body = await req.json() as CreateCommentDto;

    if (!body.content) {
      throw AppError.badRequest("content는 필수입니다");
    }

    const comment = await this.commentUseCase.createComment(params.postId, body, authUser.userId);

    return Response.json({ data: comment, message: "댓글이 작성되었습니다" }, { status: 201 });
  }

  async getCommentsByPostId(_req: Request, params: Record<string, string>): Promise<Response> {
    const comments = await this.commentUseCase.getCommentsByPostId(params.postId);

    return Response.json({ data: comments, count: comments.length });
  }

  async updateComment(req: Request, params: Record<string, string>): Promise<Response> {
    const authUser = await extractAuthUser(req);
    const body = await req.json() as UpdateCommentDto;

    if (!body.content) {
      throw AppError.badRequest("content는 필수입니다");
    }

    const comment = await this.commentUseCase.updateComment(params.commentId, body, authUser.userId);

    return Response.json({ data: comment, message: "댓글이 수정되었습니다" });
  }

  async deleteComment(req: Request, params: Record<string, string>): Promise<Response> {
    const authUser = await extractAuthUser(req);

    await this.commentUseCase.deleteComment(params.commentId, authUser.userId);

    return Response.json({ message: "댓글이 삭제되었습니다" });
  }
}
