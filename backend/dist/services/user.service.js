"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
const prisma_1 = require("../utils/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
async function createUser(email, password, name, role = client_1.Role.USER) {
    const hash = await bcrypt_1.default.hash(password, 10);
    return prisma_1.prisma.user.create({ data: { email, password: hash, name, role } });
}
async function findUserByEmail(email) {
    return prisma_1.prisma.user.findUnique({ where: { email } });
}
