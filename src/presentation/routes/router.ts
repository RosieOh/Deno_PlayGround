import { AppError } from "../../shared/errors/app.error.ts";

type Handler = (req: Request, params: Record<string, string>) => Response | Promise<Response>;

interface Route {
  method: string;
  pattern: URLPattern;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  private addRoute(method: string, path: string, handler: Handler) {
    const pattern = new URLPattern({ pathname: path });
    this.routes.push({ method, pattern, handler });
  }

  get(path: string, handler: Handler) {
    this.addRoute("GET", path, handler);
    return this;
  }

  post(path: string, handler: Handler) {
    this.addRoute("POST", path, handler);
    return this;
  }

  put(path: string, handler: Handler) {
    this.addRoute("PUT", path, handler);
    return this;
  }

  delete(path: string, handler: Handler) {
    this.addRoute("DELETE", path, handler);
    return this;
  }

  async handle(req: Request): Promise<Response> {
    // CORS 헤더
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Preflight 요청 처리
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = req.url;

    for (const route of this.routes) {
      const match = route.pattern.exec(url);
      if (match && req.method === route.method) {
        const params = match.pathname.groups as Record<string, string>;
        try {
          const response = await route.handler(req, params);
          // CORS 헤더 추가
          const newHeaders = new Headers(response.headers);
          Object.entries(corsHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value);
          });
          return new Response(response.body, {
            status: response.status,
            headers: newHeaders,
          });
        } catch (error) {
          return this.handleError(error, corsHeaders);
        }
      }
    }

    return Response.json(
      { error: "Not Found", message: "요청한 경로를 찾을 수 없습니다" },
      { status: 404, headers: corsHeaders }
    );
  }

  private handleError(error: unknown, corsHeaders: Record<string, string>): Response {
    console.error("Error:", error);

    if (error instanceof AppError) {
      return Response.json(
        { error: error.code ?? "ERROR", message: error.message },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "INVALID_JSON", message: "잘못된 JSON 형식입니다" },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      { error: "INTERNAL_ERROR", message: "서버 내부 오류가 발생했습니다" },
      { status: 500, headers: corsHeaders }
    );
  }
}
