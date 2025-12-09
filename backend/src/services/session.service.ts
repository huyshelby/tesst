import { prisma } from "../utils/prisma";
import { addDays } from "date-fns";

export async function createSession(userId: string, days: number) {
  return prisma.refreshSession.create({
    data: {
      userId,
      expiresAt: addDays(new Date(), days),
    },
  });
}

export async function getSession(jti: string) {
  return prisma.refreshSession.findUnique({ where: { id: jti } });
}

export async function revokeSession(jti: string) {
  return prisma.refreshSession.update({
    where: { id: jti },
    data: { revokedAt: new Date() },
  });
}
