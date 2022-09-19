"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.create = void 0;
const authRepositories = __importStar(require("../repositories/authRepositories"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function create(email, password) {
    const emailIsRegistered = await authRepositories.findByEmail(email);
    if (emailIsRegistered) {
        throw { type: 'conflict', message: 'This email already exists!' };
    }
    const hashPassword = (0, bcrypt_1.hashSync)(password, Number(process.env.HASH_SECRET));
    const signUpData = { email, password: hashPassword };
    await authRepositories.insert(signUpData);
}
exports.create = create;
async function login(signInData) {
    const { email, password } = signInData;
    const emailIsRegistered = await authRepositories.findByEmail(email);
    if (!emailIsRegistered) {
        throw { type: 'unauthorized', message: 'Incorrect email or password!' };
    }
    const passwordCrypt = (0, bcrypt_1.compareSync)(password, emailIsRegistered.password);
    if (!passwordCrypt) {
        throw { type: 'unauthorized', message: 'Incorrect email or password!!' };
    }
    const SECRET = process.env.JWT_KEY ?? '';
    const EXPIRES_IN = process.env.EXPIRES_IN;
    const payload = {
        userId: emailIsRegistered.id
    };
    const jwtConfig = {
        expiresIn: EXPIRES_IN
    };
    const token = jsonwebtoken_1.default.sign(payload, SECRET, jwtConfig);
    return token;
}
exports.login = login;
