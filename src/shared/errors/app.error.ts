export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, code?: string): AppError {
    return new AppError(400, message, code);
  }

  static unauthorized(message = "인증이 필요합니다"): AppError {
    return new AppError(401, message, "UNAUTHORIZED");
  }

  static forbidden(message = "권한이 없습니다"): AppError {
    return new AppError(403, message, "FORBIDDEN");
  }

  static notFound(message: string): AppError {
    return new AppError(404, message, "NOT_FOUND");
  }

  static conflict(message: string): AppError {
    return new AppError(409, message, "CONFLICT");
  }
}
