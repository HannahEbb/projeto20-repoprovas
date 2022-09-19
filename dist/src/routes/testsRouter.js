"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenValidator_1 = require("../middlewares/tokenValidator");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const testSchema_1 = __importDefault(require("../schemas/testSchema"));
const testsControllers_1 = require("../controllers/testsControllers");
const testsRouter = (0, express_1.Router)();
testsRouter.post('/tests', (0, schemaValidator_1.schemaValidator)(testSchema_1.default), tokenValidator_1.tokenValidation, testsControllers_1.writeNewTest); //schemaValidator(testSchema)
testsRouter.get('/tests/discipline/:discipline', tokenValidator_1.tokenValidation, testsControllers_1.readTestsByDiscipline);
testsRouter.get('/tests/teacher/:teacher', tokenValidator_1.tokenValidation, testsControllers_1.readTestsByTeacher);
exports.default = testsRouter;
