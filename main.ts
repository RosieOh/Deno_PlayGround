import { Router } from "./router.ts";
import {
  getRoot,
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./handlers.ts";
import { getSwaggerUI, getOpenApiJson } from "./swagger.ts";

// 라우터 설정
const router = new Router();

router
  .get("/", getRoot)
  .get("/api/docs", getSwaggerUI)
  .get("/api/docs/openapi.json", getOpenApiJson)
  .get("/api/todos", getTodos)
  .get("/api/todos/:id", getTodoById)
  .post("/api/todos", createTodo)
  .put("/api/todos/:id", updateTodo)
  .delete("/api/todos/:id", deleteTodo);

// 서버 시작
const PORT = 8000;

console.log(`🦕 Dino API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);

Deno.serve({ port: PORT }, router.handle.bind(router));
