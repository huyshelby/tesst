import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: Role = Role.USER
) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hash, name, role } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
