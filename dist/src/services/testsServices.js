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
exports.teacherNameTranslate = exports.getTestsByTeacher = exports.disciplineNameTranslate = exports.getTestsByDiscipline = exports.create = void 0;
const testsRepositories = __importStar(require("../repositories/testsRepositories"));
async function create(name, pdfUrl, category, discipline, teacher) {
    const categoryIsRegistered = await testsRepositories.findCategoryByName(category);
    if (!categoryIsRegistered) {
        throw { type: 'not_found', message: 'No category registered with this name!' };
    }
    const categoryId = categoryIsRegistered.id;
    const disciplineIsRegistered = await testsRepositories.findDisciplineByName(discipline);
    if (!disciplineIsRegistered) {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }
    const disciplineId = disciplineIsRegistered.id;
    console.log(disciplineId);
    const teacherIsRegistered = await testsRepositories.findTeacherByName(teacher);
    if (!teacherIsRegistered) {
        throw { type: 'not_found', message: 'No teacher registered with this name!' };
    }
    const teacherId = teacherIsRegistered.id;
    console.log(teacherId);
    const teacherDisciplineIsRegistered = await testsRepositories.findTeachersDisciplineByIds(teacherId, disciplineId);
    if (!teacherDisciplineIsRegistered) {
        throw { type: 'not_found', message: 'No relations found between teacher and discipline informed' };
    }
    const teacherDisciplineId = teacherDisciplineIsRegistered.id;
    const testData = {
        name,
        pdfUrl,
        categoryId,
        teacherDisciplineId
    };
    await testsRepositories.insertTest(testData);
}
exports.create = create;
async function getTestsByDiscipline(discipline) {
    const disciplineName = await disciplineNameTranslate(discipline);
    if (disciplineName.length === 0) {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }
    const disciplineIsRegistered = await testsRepositories.findDisciplineByName(disciplineName);
    if (!disciplineIsRegistered) {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }
    const disciplineId = disciplineIsRegistered.id;
    const testsDiscipline = await testsRepositories.findTestsByDiscipline(disciplineId);
    if (!testsDiscipline) {
        throw { type: 'not_found', message: 'No tests found from this discipline.' };
    }
    return testsDiscipline; //manda para o controller
}
exports.getTestsByDiscipline = getTestsByDiscipline;
async function disciplineNameTranslate(discipline) {
    if (discipline === 'html-e-css') {
        const disciplineName = 'HTML e CSS';
        return disciplineName;
    }
    else if (discipline === 'javascript') {
        const disciplineName = 'JavaScript';
        return disciplineName;
    }
    else if (discipline === 'react') {
        const disciplineName = 'React';
        return disciplineName;
    }
    else if (discipline === 'humildade') {
        const disciplineName = 'Humildade';
        return disciplineName;
    }
    else if (discipline === 'planejamento') {
        const disciplineName = 'Planejamento';
        return disciplineName;
    }
    else if (discipline === 'autoconfianca' || 'autoconfiança') {
        const disciplineName = 'Autoconfiança';
        return disciplineName;
    }
    else {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }
}
exports.disciplineNameTranslate = disciplineNameTranslate;
async function getTestsByTeacher(teacher) {
    const teacherName = await teacherNameTranslate(teacher);
    const teacherIsRegistered = await testsRepositories.findTeacherByName(teacherName);
    if (!teacherIsRegistered) {
        throw { type: 'not_found', message: 'No teacher registered with this name!' };
    }
    const teacherId = teacherIsRegistered.id;
    const testsTeacher = await testsRepositories.findTestsByTeacher(teacherId);
    if (!testsTeacher) {
        throw { type: 'not_found', message: 'No tests found for this teacher.' };
    }
    return testsTeacher; //manda para o controller
}
exports.getTestsByTeacher = getTestsByTeacher;
async function teacherNameTranslate(teacher) {
    if (teacher === 'diego-pinho') {
        const teacherName = 'Diego Pinho';
        return teacherName;
    }
    else if (teacher === 'bruna-hamori') {
        const teacherName = 'Bruna Hamori';
        return teacherName;
    }
    else {
        throw { type: 'not_found', message: 'No teacher registered with this name.' };
    }
}
exports.teacherNameTranslate = teacherNameTranslate;
