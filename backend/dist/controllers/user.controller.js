"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
const prisma_1 = require("../utils/prisma");
async function me(req, res) {
    const id = req.user.userId;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, createdAt: true },
    });
    res.json(user);
}
