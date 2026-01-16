// OpenAPI 3.0 스펙 정의
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Dino API",
    description: "Deno 기반 Todo API 예제",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "로컬 개발 서버",
    },
  ],
  paths: {
    "/": {
      get: {
        summary: "API 정보",
        description: "API 엔드포인트 목록을 반환합니다",
        responses: {
          "200": {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    endpoints: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/todos": {
      get: {
        tags: ["Todos"],
        summary: "모든 할 일 조회",
        description: "등록된 모든 할 일 목록을 반환합니다",
        responses: {
          "200": {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Todo" },
                    },
                    count: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Todos"],
        summary: "새 할 일 생성",
        description: "새로운 할 일을 생성합니다",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTodo" },
            },
          },
        },
        responses: {
          "201": {
            description: "생성 완료",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Todo" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/todos/{id}": {
      get: {
        tags: ["Todos"],
        summary: "특정 할 일 조회",
        description: "ID로 특정 할 일을 조회합니다",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "할 일 ID",
          },
        ],
        responses: {
          "200": {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Todo" },
                  },
                },
              },
            },
          },
          "404": {
            description: "찾을 수 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Todos"],
        summary: "할 일 수정",
        description: "기존 할 일을 수정합니다",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "할 일 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTodo" },
            },
          },
        },
        responses: {
          "200": {
            description: "수정 완료",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Todo" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "404": {
            description: "찾을 수 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Todos"],
        summary: "할 일 삭제",
        description: "할 일을 삭제합니다",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "할 일 ID",
          },
        ],
        responses: {
          "200": {
            description: "삭제 완료",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Todo" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "404": {
            description: "찾을 수 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Todo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Deno 배우기" },
          completed: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateTodo: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "새로운 할 일" },
          completed: { type: "boolean", default: false },
        },
      },
      UpdateTodo: {
        type: "object",
        properties: {
          title: { type: "string", example: "수정된 할 일" },
          completed: { type: "boolean" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "에러 메시지" },
        },
      },
    },
  },
};
