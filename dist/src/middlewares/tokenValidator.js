"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function tokenValidation(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) {
        throw { type: 'unauthorized', message: 'Missing token!' };
    }
    const token = auth.split(' ')[1];
    const SECRET = process.env.JWT_KEY ?? '';
    try {
        jsonwebtoken_1.default.verify(token, SECRET);
        const tokenData = jsonwebtoken_1.default.verify(token, SECRET);
        res.locals.userId = tokenData.userId;
        next();
    }
    catch (error) {
        return res.status(400).send('Invalid token!');
    }
}
exports.tokenValidation = tokenValidation;
