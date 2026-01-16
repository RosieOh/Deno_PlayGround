import { Router } from "./presentation/routes/router.ts";

// Repositories
import { InMemoryUserRepository } from "./infrastructure/repositories/user.repository.impl.ts";
import { InMemoryCommentRepository } from "./infrastructure/repositories/comment.repository.impl.ts";
import { InMemoryPostRepository } from "./infrastructure/repositories/post.repository.impl.ts";

// Use Cases
import { AuthUseCase } from "./application/usecases/auth.usecase.ts";
import { PostUseCase } from "./application/usecases/post.usecase.ts";
import { CommentUseCase } from "./application/usecases/comment.usecase.ts";

// Controllers
import { AuthController } from "./presentation/controllers/auth.controller.ts";
import { PostController } from "./presentation/controllers/post.controller.ts";
import { CommentController } from "./presentation/controllers/comment.controller.ts";

// Swagger
import { getSwaggerUI, getOpenApiJson } from "./openapi.ts";

// ===== 의존성 주입 (DI) =====

// Repositories
const userRepository = new InMemoryUserRepository();
const commentRepository = new InMemoryCommentRepository(userRepository);
const postRepository = new InMemoryPostRepository(userRepository, commentRepository);

// Use Cases
const authUseCase = new AuthUseCase(userRepository);
const postUseCase = new PostUseCase(postRepository);
const commentUseCase = new CommentUseCase(commentRepository, postRepository);

// Controllers
const authController = new AuthController(authUseCase);
const postController = new PostController(postUseCase);
const commentController = new CommentController(commentUseCase);

// ===== 라우터 설정 =====

const router = new Router();

// Root & Docs
router
  .get("/", () =>
    Response.json({
      message: "🦕 Dino Board API에 오신 것을 환영합니다!",
      docs: "/api/docs",
      version: "1.0.0",
    })
  )
  .get("/api/docs", getSwaggerUI)
  .get("/api/docs/openapi.json", getOpenApiJson);

// Auth
router
  .post("/api/auth/register", (req) => authController.register(req))
  .post("/api/auth/login", (req) => authController.login(req));

// Posts
router
  .get("/api/posts", (req) => postController.getPosts(req))
  .post("/api/posts", (req) => postController.createPost(req))
  .get("/api/posts/:id", (req, params) => postController.getPostById(req, params))
  .put("/api/posts/:id", (req, params) => postController.updatePost(req, params))
  .delete("/api/posts/:id", (req, params) => postController.deletePost(req, params));

// Comments
router
  .get("/api/posts/:postId/comments", (req, params) => commentController.getCommentsByPostId(req, params))
  .post("/api/posts/:postId/comments", (req, params) => commentController.createComment(req, params))
  .put("/api/comments/:commentId", (req, params) => commentController.updateComment(req, params))
  .delete("/api/comments/:commentId", (req, params) => commentController.deleteComment(req, params));

// ===== 서버 시작 =====

const PORT = 8000;

console.log(`
🦕 ================================================
   Dino Board API Server

   Server:  http://localhost:${PORT}
   Swagger: http://localhost:${PORT}/api/docs
================================================
`);

Deno.serve({ port: PORT }, router.handle.bind(router));
