import { prisma } from '../database';
import { ITestData } from '../types/testTypes';


export async function findCategoryByName(category: string) {
    const result = await prisma.categories.findUnique({where: { name: category }});
    return result;
}


export async function findDisciplineByName(discipline: string) {
    const result = await prisma.disciplines.findUnique({where: { name: discipline }});
    return result;
}

export async function findDisciplineByParam(disciplineName: string) { //tentei filtrar a disciplina assim para não "chumbar" os nomes, mas não retornava nada.
    const result = await prisma.categories.findFirst({
        where: { 
            name: {
                startsWith: disciplineName,
                mode: 'insensitive'
            } }
        });
    return result;
}

export async function findTeacherByName(teacher: string) {
    const result = await prisma.teachers.findUnique({where: { name: teacher }});
    return result;
}

export async function findTeacherByParam(teacherName: string) {
    const result = await prisma.categories.findFirst({
        where: { 
            name: {
                startsWith: teacherName,
                mode: 'insensitive',
            } }});
    return result;
}

export async function findTeachersDisciplineByIds(disciplineId: number, teacherId: number) {
    const result = await prisma.teachersDisciplines.findFirst({
        where: { teacherId, disciplineId }
    });
    return result;
}

export async function insertTest(testData: ITestData) {
    return prisma.tests.create({
      data: { ...testData}
    });
}

export async function findTestsByDiscipline(disciplineId: number) {
    const result = await prisma.disciplines.findMany({
        where: {id: disciplineId},
        select: {
            name: true,
            TeachersDisciplines:{
                select: {
                    Tests: { distinct: ['categoryId'],
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                Tests: {
                                    select:{
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: [{category: {name: "desc"}}]
                    }
                }
            }
        }     
    }
);
return result;
}

export async function findTestsByTeacher(teacherId: number) {
    const result = await prisma.teachers.findMany({
        where: {id: teacherId},
        select: {
            name: true,
            TeachersDisciplines:{
                select: {
                    Tests: { distinct: ['categoryId'],
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                Tests: {
                                    select:{
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: [{category: {name: "desc"}}]
                    }
                }
            }
        }
    });
    return result;
}

