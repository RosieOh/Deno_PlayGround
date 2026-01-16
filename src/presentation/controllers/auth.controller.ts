import type { AuthUseCase } from "../../application/usecases/auth.usecase.ts";
import type { RegisterDto, LoginDto } from "../../application/dto/auth.dto.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async register(req: Request): Promise<Response> {
    const body = await req.json() as RegisterDto;

    // 간단한 유효성 검사
    if (!body.email || !body.username || !body.password) {
      throw AppError.badRequest("email, username, password는 필수입니다");
    }

    if (body.password.length < 4) {
      throw AppError.badRequest("비밀번호는 4자 이상이어야 합니다");
    }

    const result = await this.authUseCase.register(body);

    return Response.json({ data: result, message: "회원가입이 완료되었습니다" }, { status: 201 });
  }

  async login(req: Request): Promise<Response> {
    const body = await req.json() as LoginDto;

    if (!body.email || !body.password) {
      throw AppError.badRequest("email, password는 필수입니다");
    }

    const result = await this.authUseCase.login(body);

    return Response.json({ data: result, message: "로그인되었습니다" });
  }
}
