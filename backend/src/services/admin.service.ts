import prisma from "../config/db";

export const getAllUsersService = async () => {
  return await prisma.user.findMany({
    where: { isVoid: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gender: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserByIdService = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isVoid: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gender: true,
      role: true,
      isActive: true,
      createdAt: true,
      tasks: {
        where: { isVoid: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUserService = async (userId: number) => {
  const user = await prisma.user.findFirst({ where: { id: userId, isVoid: false } });

  if (!user) throw new Error("User not found");

  await prisma.task.updateMany({
    where: { userId, isVoid: false },
    data: { isVoid: true, isActive: false },
  });

  return await prisma.user.update({
    where: { id: userId },
    data: { isVoid: true, isActive: false },
    select: { id: true, name: true, email: true },
  });
};