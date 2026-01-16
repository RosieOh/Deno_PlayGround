import type { PostUseCase } from "../../application/usecases/post.usecase.ts";
import type { CreatePostDto, UpdatePostDto } from "../../application/dto/post.dto.ts";
import { extractAuthUser } from "../middlewares/auth.middleware.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export class PostController {
  constructor(private postUseCase: PostUseCase) {}

  async createPost(req: Request): Promise<Response> {
    const authUser = await extractAuthUser(req);
    const body = await req.json() as CreatePostDto;

    if (!body.title || !body.content) {
      throw AppError.badRequest("title, content는 필수입니다");
    }

    const post = await this.postUseCase.createPost(body, authUser.userId);

    return Response.json({ data: post, message: "게시글이 작성되었습니다" }, { status: 201 });
  }

  async getPosts(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "10");
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    const result = await this.postUseCase.getPosts(limit, offset);

    return Response.json(result);
  }

  async getPostById(_req: Request, params: Record<string, string>): Promise<Response> {
    const post = await this.postUseCase.getPostById(params.id);

    return Response.json({ data: post });
  }

  async updatePost(req: Request, params: Record<string, string>): Promise<Response> {
    const authUser = await extractAuthUser(req);
    const body = await req.json() as UpdatePostDto;

    if (!body.title && !body.content) {
      throw AppError.badRequest("title 또는 content 중 하나는 필수입니다");
    }

    const post = await this.postUseCase.updatePost(params.id, body, authUser.userId);

    return Response.json({ data: post, message: "게시글이 수정되었습니다" });
  }

  async deletePost(req: Request, params: Record<string, string>): Promise<Response> {
    const authUser = await extractAuthUser(req);

    await this.postUseCase.deletePost(params.id, authUser.userId);

    return Response.json({ message: "게시글이 삭제되었습니다" });
  }
}
