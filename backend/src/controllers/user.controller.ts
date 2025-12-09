import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function me(req: Request, res: Response) {
  const id = req.user!.userId;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(user);
}
