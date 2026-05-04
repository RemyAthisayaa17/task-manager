import prisma from "../config/db";
import { CreateTaskInput, UpdateTaskInput } from "../types/task.types";
import { ROLES } from "../constants/roles";
import { TASK_STATUS } from "../constants/taskStatus";

const adminInclude = { user: { select: { id: true, name: true, email: true } } };

export const createTaskService = async (data: CreateTaskInput) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: TASK_STATUS.PENDING,
      isVoid: false,
      userId: data.userId,
      createdBy: data.userId, // authenticated user creating the task
    },
  });
};

export const getAllTasksService = async (userId: number, role: string) => {
  if (role === ROLES.ADMIN) {
    return await prisma.task.findMany({
      where: { isVoid: false },
      orderBy: { createdAt: "desc" },
      include: adminInclude,
    });
  }

  return await prisma.task.findMany({
    where: { userId, isVoid: false },
    orderBy: { createdAt: "desc" },
  });
};

export const getTaskByIdService = async (taskId: number, userId: number, role: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, isVoid: false },
    include: adminInclude,
  });

  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");

  return task;
};

export const updateTaskService = async (
  taskId: number,
  userId: number,
  role: string,
  updates: UpdateTaskInput
) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, isVoid: false } });

  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status && { status: updates.status }),
      updatedBy: userId, // always stamp who made this change
    },
  });
};

export const deleteTaskService = async (taskId: number, userId: number, role: string) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, isVoid: false } });

  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      isVoid: true,
      isActive: false,
      updatedBy: userId, // soft-delete also counts as an update
    },
  });
};

export const searchTasksService = async (userId: number, role: string, query: string) => {
  return await prisma.task.findMany({
    where: {
      isVoid: false,
      title: { contains: query, mode: "insensitive" },
      ...(role !== ROLES.ADMIN && { userId }),
    },
    orderBy: { createdAt: "desc" },
    include: role === ROLES.ADMIN ? adminInclude : undefined,
  });
};

export const filterTasksByStatusService = async (userId: number, role: string, status: string) => {
  return await prisma.task.findMany({
    where: {
      isVoid: false,
      status,
      ...(role !== ROLES.ADMIN && { userId }),
    },
    orderBy: { createdAt: "desc" },
    include: role === ROLES.ADMIN ? adminInclude : undefined,
  });
};

export const getPaginatedTasksService = async (
  userId: number,
  role: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const where = { isVoid: false, ...(role !== ROLES.ADMIN && { userId }) };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: role === ROLES.ADMIN ? adminInclude : undefined,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};