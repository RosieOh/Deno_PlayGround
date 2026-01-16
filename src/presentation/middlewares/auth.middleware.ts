import { verifyToken } from "../../shared/utils/jwt.ts";
import { AppError } from "../../shared/errors/app.error.ts";

export interface AuthUser {
  userId: string;
  email: string;
}

export async function extractAuthUser(req: Request): Promise<AuthUser> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError.unauthorized("인증 토큰이 필요합니다");
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload) {
    throw AppError.unauthorized("유효하지 않거나 만료된 토큰입니다");
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

export async function optionalAuthUser(req: Request): Promise<AuthUser | null> {
  try {
    return await extractAuthUser(req);
  } catch {
    return null;
  }
}
