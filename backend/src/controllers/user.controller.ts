import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export async function me(req: Request, res: Response) {
  const id = req.user!.id;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  res.json({ user });
}
