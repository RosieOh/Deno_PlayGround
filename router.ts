// 간단한 라우터 구현
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
    const url = req.url;

    for (const route of this.routes) {
      const match = route.pattern.exec(url);
      if (match && req.method === route.method) {
        const params = match.pathname.groups as Record<string, string>;
        try {
          return await route.handler(req, params);
        } catch (error) {
          console.error("Handler error:", error);
          return json({ error: "Internal Server Error" }, 500);
        }
      }
    }

    return json({ error: "Not Found" }, 404);
  }
}

// 유틸리티 함수
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
