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

export async function findTeacherByName(teacher: string) {
    const result = await prisma.teachers.findUnique({where: { name: teacher }});
    return result;
}

export async function findTeachersDiscipliensByIds(disciplineId: number, teacherId: number) {
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
