export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Dino Board API",
    description: "Deno Clean Architecture 기반 게시판 API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:8000", description: "로컬 개발 서버" }],
  tags: [
    { name: "Auth", description: "인증 관련 API" },
    { name: "Posts", description: "게시글 관련 API" },
    { name: "Comments", description: "댓글 관련 API" },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": { description: "회원가입 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "400": { description: "잘못된 요청" },
          "409": { description: "중복된 이메일/사용자명" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": { description: "로그인 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "401": { description: "인증 실패" },
        },
      },
    },
    "/api/posts": {
      get: {
        tags: ["Posts"],
        summary: "게시글 목록 조회",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": { description: "성공", content: { "application/json": { schema: { $ref: "#/components/schemas/PostListResponse" } } } },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "게시글 작성",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
            },
          },
        },
        responses: {
          "201": { description: "생성 성공" },
          "401": { description: "인증 필요" },
        },
      },
    },
    "/api/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "게시글 상세 조회",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "성공" },
          "404": { description: "게시글 없음" },
        },
      },
      put: {
        tags: ["Posts"],
        summary: "게시글 수정",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePostRequest" },
            },
          },
        },
        responses: {
          "200": { description: "수정 성공" },
          "401": { description: "인증 필요" },
          "403": { description: "권한 없음" },
          "404": { description: "게시글 없음" },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "게시글 삭제",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "삭제 성공" },
          "401": { description: "인증 필요" },
          "403": { description: "권한 없음" },
          "404": { description: "게시글 없음" },
        },
      },
    },
    "/api/posts/{postId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "댓글 목록 조회",
        parameters: [{ name: "postId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "성공" },
          "404": { description: "게시글 없음" },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "댓글 작성",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "postId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentRequest" },
            },
          },
        },
        responses: {
          "201": { description: "생성 성공" },
          "401": { description: "인증 필요" },
          "404": { description: "게시글 없음" },
        },
      },
    },
    "/api/comments/{commentId}": {
      put: {
        tags: ["Comments"],
        summary: "댓글 수정",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "commentId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCommentRequest" },
            },
          },
        },
        responses: {
          "200": { description: "수정 성공" },
          "401": { description: "인증 필요" },
          "403": { description: "권한 없음" },
          "404": { description: "댓글 없음" },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "댓글 삭제",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "commentId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "삭제 성공" },
          "401": { description: "인증 필요" },
          "403": { description: "권한 없음" },
          "404": { description: "댓글 없음" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "username", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          username: { type: "string", example: "홍길동" },
          password: { type: "string", minLength: 4, example: "password123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", example: "password123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  username: { type: "string" },
                },
              },
            },
          },
          message: { type: "string" },
        },
      },
      CreatePostRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "게시글 제목" },
          content: { type: "string", example: "게시글 내용입니다." },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "수정된 제목" },
          content: { type: "string", example: "수정된 내용입니다." },
        },
      },
      PostListResponse: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Post" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          author: {
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
            },
          },
          commentCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", example: "댓글 내용입니다." },
        },
      },
      UpdateCommentRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", example: "수정된 댓글 내용입니다." },
        },
      },
    },
  },
};

export function getSwaggerUI(): Response {
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dino Board API - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>body { margin: 0; } .swagger-ui .topbar { display: none; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export function getOpenApiJson(): Response {
  return new Response(JSON.stringify(openApiSpec, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
