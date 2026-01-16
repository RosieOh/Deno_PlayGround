import type { User } from "../entities/user.entity.ts";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, data: Partial<Pick<User, "email" | "username" | "passwordHash">>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
