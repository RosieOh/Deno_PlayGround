import type { IUserRepository } from "../../domain/interfaces/user.repository.ts";
import type { RegisterDto, LoginDto, AuthResponse } from "../dto/auth.dto.ts";
import { AppError } from "../../shared/errors/app.error.ts";
import { hashPassword, verifyPassword } from "../../shared/utils/password.ts";
import { generateToken } from "../../shared/utils/jwt.ts";

export class AuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // 이메일 중복 체크
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw AppError.conflict("이미 사용 중인 이메일입니다");
    }

    // 사용자명 중복 체크
    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw AppError.conflict("이미 사용 중인 사용자명입니다");
    }

    // 비밀번호 해시
    const passwordHash = await hashPassword(dto.password);

    // 사용자 생성
    const user = await this.userRepository.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    // 토큰 생성
    const token = await generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // 사용자 조회
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw AppError.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다");
    }

    // 비밀번호 검증
    const isValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다");
    }

    // 토큰 생성
    const token = await generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
