"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const testSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "any.required": "Você deve informar um nome!"
    }),
    pdfUrl: joi_1.default.string().uri().required().messages({
        "any.required": "Você deve informar uma url válida!"
    }),
    category: joi_1.default.string().valid("Projeto", "Prática", "Recuperação").required().messages({
        "any.required": "Você deve informar uma categoria!",
        "string.valid": "Informe uma categoria válida: Prova, Prática ou Recuperação"
    }),
    discipline: joi_1.default.string().required().messages({
        "any.required": "Você deve informar uma disciplina!"
    }),
    teacher: joi_1.default.string().required().messages({
        "any.required": "Você deve informar um(a) instrutor(a)!"
    })
});
exports.default = testSchema;
