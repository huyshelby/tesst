"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.revokeSession = revokeSession;
const prisma_1 = require("../utils/prisma");
const date_fns_1 = require("date-fns");
async function createSession(userId, days) {
    return prisma_1.prisma.refreshSession.create({
        data: {
            userId,
            expiresAt: (0, date_fns_1.addDays)(new Date(), days),
        },
    });
}
async function getSession(jti) {
    return prisma_1.prisma.refreshSession.findUnique({ where: { id: jti } });
}
async function revokeSession(jti) {
    return prisma_1.prisma.refreshSession.update({
        where: { id: jti },
        data: { revokedAt: new Date() },
    });
}
