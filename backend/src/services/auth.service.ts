import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../types/user.types";

export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gender: true,
      role: true,
      createdAt: true,
    },
  });
};

export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || user.isVoid) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};