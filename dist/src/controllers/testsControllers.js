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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTestsByTeacher = exports.readTestsByDiscipline = exports.writeNewTest = void 0;
const testsServices = __importStar(require("../services/testsServices"));
async function writeNewTest(req, res) {
    const { name, pdfUrl, category, discipline, teacher } = req.body;
    await testsServices.create(name, pdfUrl, category, discipline, teacher);
    res.sendStatus(201);
}
exports.writeNewTest = writeNewTest;
async function readTestsByDiscipline(req, res) {
    const { discipline } = req.params;
    const testsByDiscipline = await testsServices.getTestsByDiscipline(discipline);
    res.send(testsByDiscipline).status(200);
}
exports.readTestsByDiscipline = readTestsByDiscipline;
async function readTestsByTeacher(req, res) {
    const { teacher } = req.params;
    const testsByTeacher = await testsServices.getTestsByTeacher(teacher);
    res.send(testsByTeacher).status(200);
}
exports.readTestsByTeacher = readTestsByTeacher;
