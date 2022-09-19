"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function __createToken(id) {
    const SECRET = process.env.JWT_KEY ?? '';
    const EXPIRES_IN = process.env.EXPIRES_IN;
    const payload = {
        userId: id
    };
    const jwtConfig = {
        expiresIn: EXPIRES_IN
    };
    const token = jsonwebtoken_1.default.sign(payload, SECRET, jwtConfig);
    return token;
}
exports.default = __createToken;
