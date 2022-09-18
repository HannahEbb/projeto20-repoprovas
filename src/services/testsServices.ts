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

    const teacherDisciplineIsRegistered = await testsRepositories.findTeachersDisciplineByIds(teacherId, disciplineId);
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

export async function getTestsByDiscipline(discipline: string) {
    const disciplineName: any = await disciplineNameTranslate(discipline);
    
    const disciplineIsRegistered = await testsRepositories.findDisciplineByName(disciplineName);
    if(!disciplineIsRegistered) {
        throw { type: 'not_found', message: 'No discipline registered with this name!' };
    }

    const disciplineId = disciplineIsRegistered.id;

    const testsDiscipline = await testsRepositories.findTestsByDiscipline(disciplineId);
    if(!testsDiscipline) {
        throw { type: 'not_found', message: 'No tests found from this discipline.' };
    }

    return testsDiscipline; //manda para o controller

}

export async function disciplineNameTranslate(discipline: string) {
    if(discipline === 'html-e-css'){
        const disciplineName : string = 'HTML e CSS';
        return disciplineName; 
    } 
    else if(discipline === 'javascript'){
        const disciplineName : string= 'JavaScript';
        return disciplineName; 
    } 
    else if(discipline === 'react'){
        const disciplineName : string = 'React';
        return disciplineName; 
    } 
    else if(discipline === 'humildade'){
        const disciplineName : string = 'Humildade';
        return disciplineName; 
    } 
    else if(discipline === 'planejamento'){
        const disciplineName : string = 'Planejamento';
        return disciplineName; 
    } 
    else if(discipline === 'autoconfianca' || 'autoconfiança'){
        const disciplineName : string = 'Autoconfiança';
        return disciplineName; 
    }  else {
        throw { type: 'not_found', message: 'No discipline registered with this name.' };
    }
}

export async function getTestsByTeacher(teacher: string) {
    const teacherName: any = await teacherNameTranslate(teacher);

    const teacherIsRegistered = await testsRepositories.findTeacherByName(teacherName);
    if(!teacherIsRegistered) {
        throw { type: 'not_found', message: 'No teacher registered with this name!' };
    }

    const teacherId = teacherIsRegistered.id;

    const testsTeacher = await testsRepositories.findTestsByTeacher(teacherId);
    if(!testsTeacher) {
        throw { type: 'not_found', message: 'No tests found for this teacher.' };
    }

    return testsTeacher; //manda para o controller

}

export async function teacherNameTranslate(teacher: string) {
    if(teacher === 'diego-pinho'){
        const teacherName : string = 'Diego Pinho';
        return teacherName; 
    } 
    else if(teacher === 'bruna-hamori'){
        const teacherName : string= 'Bruna Hamori';
        return teacherName; 
    } else {
        throw { type: 'not_found', message: 'No teacher registered with this name.' };
    }
    
}