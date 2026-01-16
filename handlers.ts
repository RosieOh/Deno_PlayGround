import { json } from "./router.ts";

// 간단한 인메모리 데이터베이스
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

let todos: Todo[] = [
  { id: 1, title: "Deno 배우기", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "API 만들기", completed: true, createdAt: new Date().toISOString() },
];

let nextId = 3;

// 핸들러 함수들
export function getRoot(_req: Request): Response {
  return json({
    message: "Dino API에 오신 것을 환영합니다! 🦕",
    endpoints: {
      "GET /api/todos": "모든 할 일 조회",
      "GET /api/todos/:id": "특정 할 일 조회",
      "POST /api/todos": "새 할 일 생성",
      "PUT /api/todos/:id": "할 일 수정",
      "DELETE /api/todos/:id": "할 일 삭제",
    },
  });
}

export function getTodos(_req: Request): Response {
  return json({ data: todos, count: todos.length });
}

export function getTodoById(_req: Request, params: Record<string, string>): Response {
  const id = parseInt(params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return json({ error: "할 일을 찾을 수 없습니다" }, 404);
  }

  return json({ data: todo });
}

export async function createTodo(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    if (!body.title || typeof body.title !== "string") {
      return json({ error: "title은 필수 문자열입니다" }, 400);
    }

    const newTodo: Todo = {
      id: nextId++,
      title: body.title,
      completed: body.completed ?? false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return json({ data: newTodo, message: "할 일이 생성되었습니다" }, 201);
  } catch {
    return json({ error: "잘못된 JSON 형식입니다" }, 400);
  }
}

export async function updateTodo(req: Request, params: Record<string, string>): Promise<Response> {
  const id = parseInt(params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return json({ error: "할 일을 찾을 수 없습니다" }, 404);
  }

  try {
    const body = await req.json();
    const todo = todos[todoIndex];

    if (body.title !== undefined) {
      todo.title = body.title;
    }
    if (body.completed !== undefined) {
      todo.completed = body.completed;
    }

    return json({ data: todo, message: "할 일이 수정되었습니다" });
  } catch {
    return json({ error: "잘못된 JSON 형식입니다" }, 400);
  }
}

export function deleteTodo(_req: Request, params: Record<string, string>): Response {
  const id = parseInt(params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return json({ error: "할 일을 찾을 수 없습니다" }, 404);
  }

  const deleted = todos.splice(todoIndex, 1)[0];
  return json({ data: deleted, message: "할 일이 삭제되었습니다" });
}
