"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const signUpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "Você deve informar um email!",
        "string.email": "Você deve informar um formato de email válido!"
    }),
    password: joi_1.default.string().min(10).required().messages({
        "any.required": "Você deve informar a senha!",
        "string.min": "A senha deve possuir no mínimo 10 caracteres!"
    })
});
exports.default = signUpSchema;
