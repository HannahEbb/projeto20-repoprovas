"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTestsByTeacher = exports.findTestsByDiscipline = exports.insertTest = exports.findTeachersDisciplineByIds = exports.findTeacherByParam = exports.findTeacherByName = exports.findDisciplineByParam = exports.findDisciplineByName = exports.findCategoryByName = void 0;
const database_1 = require("../database");
async function findCategoryByName(category) {
    const result = await database_1.prisma.categories.findUnique({ where: { name: category } });
    return result;
}
exports.findCategoryByName = findCategoryByName;
async function findDisciplineByName(discipline) {
    const result = await database_1.prisma.disciplines.findUnique({ where: { name: discipline } });
    return result;
}
exports.findDisciplineByName = findDisciplineByName;
async function findDisciplineByParam(disciplineName) {
    const result = await database_1.prisma.categories.findFirst({
        where: {
            name: {
                startsWith: disciplineName,
                mode: 'insensitive'
            }
        }
    });
    return result;
}
exports.findDisciplineByParam = findDisciplineByParam;
async function findTeacherByName(teacher) {
    const result = await database_1.prisma.teachers.findUnique({ where: { name: teacher } });
    return result;
}
exports.findTeacherByName = findTeacherByName;
async function findTeacherByParam(teacherName) {
    const result = await database_1.prisma.categories.findFirst({
        where: {
            name: {
                startsWith: teacherName,
                mode: 'insensitive',
            }
        }
    });
    return result;
}
exports.findTeacherByParam = findTeacherByParam;
async function findTeachersDisciplineByIds(disciplineId, teacherId) {
    const result = await database_1.prisma.teachersDisciplines.findFirst({
        where: { teacherId, disciplineId }
    });
    return result;
}
exports.findTeachersDisciplineByIds = findTeachersDisciplineByIds;
async function insertTest(testData) {
    return database_1.prisma.tests.create({
        data: { ...testData }
    });
}
exports.insertTest = insertTest;
async function findTestsByDiscipline(disciplineId) {
    const result = await database_1.prisma.disciplines.findMany({
        where: { id: disciplineId },
        select: {
            name: true,
            TeachersDisciplines: {
                select: {
                    Tests: { distinct: ['categoryId'],
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    Tests: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: [{ category: { name: "desc" } }]
                    }
                }
            }
        }
    });
    return result;
}
exports.findTestsByDiscipline = findTestsByDiscipline;
async function findTestsByTeacher(teacherId) {
    const result = await database_1.prisma.teachers.findMany({
        where: { id: teacherId },
        select: {
            name: true,
            TeachersDisciplines: {
                select: {
                    Tests: { distinct: ['categoryId'],
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    Tests: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: [{ category: { name: "desc" } }]
                    }
                }
            }
        }
    });
    return result;
}
exports.findTestsByTeacher = findTestsByTeacher;
