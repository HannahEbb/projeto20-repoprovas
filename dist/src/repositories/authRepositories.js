"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = exports.findByEmail = void 0;
const database_1 = require("../database");
async function findByEmail(email) {
    const result = await database_1.prisma.user.findUnique({ where: { email } });
    return result;
}
exports.findByEmail = findByEmail;
async function insert(signUpData) {
    await database_1.prisma.user.create({ data: signUpData });
}
exports.insert = insert;
