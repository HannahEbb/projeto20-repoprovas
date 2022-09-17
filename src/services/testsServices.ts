import * as testsRepositories from "../repositories/testsRepositories";


export async function create(name: string, pdfUrl: string, category: string, discipline: string, teacher: string) {

    const categoryIsRegistered = await testsRepositories.findCategoryByName(category);
    if(!categoryIsRegistered) {
        throw { type: 'not_found', message: 'No category registered with this name!' };
    }

    const categoryId = categoryIsRegistered.id;

    const disciplineIsRegistered = await testsRepositories.findDisciplineByName(discipline);
    if(!disciplineIsRegistered) {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }

    const disciplineId = disciplineIsRegistered.id;
    console.log(disciplineId);

    const teacherIsRegistered = await testsRepositories.findTeacherByName(teacher);
    if(!teacherIsRegistered) {
        throw { type: 'not_found', message: 'No teacher registered with this name!' };
    }

    const teacherId = teacherIsRegistered.id;
    console.log(teacherId);

    const teacherDisciplineIsRegistered = await testsRepositories.findTeachersDiscipliensByIds(teacherId, disciplineId);
    if(!teacherDisciplineIsRegistered) {
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