import { Task } from '@/types/task';

export const initialMockTasks: Task[] = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    title: "Complete client onboarding flow",
    description: "Review contract, configure staging environment, and schedule kick-off call with tech leads.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    title: "Set up PostgreSQL database migrations",
    description: "Write Prisma migrations for Task schema and index optimization on Neon Postgres.",
    status: "COMPLETED",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    title: "Implement Zod request validation",
    description: "Ensure all endpoints validate query params, UUID paths, and strict JSON request bodies.",
    status: "COMPLETED",
    priority: "MEDIUM",
    dueDate: null,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    title: "Audit API rate limits and auth guards",
    description: "Test x-api-key header requirement on protected endpoints and verify 401/403 responses.",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
    title: "Write centralized error handling unit tests",
    description: "Verify that Prisma errors, malformed JSON, and unexpected errors never crash the Express server.",
    status: "PENDING",
    priority: "LOW",
    dueDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
