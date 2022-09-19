"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const signUpSchema_1 = __importDefault(require("../schemas/signUpSchema"));
const signInSchema_1 = __importDefault(require("../schemas/signInSchema"));
const authControllers_1 = require("../controllers/authControllers");
const authRouter = (0, express_1.Router)();
authRouter.post('/sign-up', (0, schemaValidator_1.schemaValidator)(signUpSchema_1.default), authControllers_1.signUp);
authRouter.post('/sign-in', (0, schemaValidator_1.schemaValidator)(signInSchema_1.default), authControllers_1.signIn);
exports.default = authRouter;
