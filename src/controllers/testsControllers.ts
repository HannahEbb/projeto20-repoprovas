import { Request, Response } from 'express';
import * as testsServices from "../services/testsServices";


export async function writeNewTest(req: Request, res: Response) {
    const { name, pdfUrl, category, discipline, teacher } = req.body;
    await testsServices.create(name, pdfUrl, category, discipline, teacher);

    res.sendStatus(201); 
}

export async function readTestsByDiscipline(req: Request, res: Response) {
    const { discipline } = req.params;

    const testsByDiscipline = await testsServices.getTestsByDiscipline(discipline);

    res.send(testsByDiscipline).status(200);
}

export async function readTestsByTeacher(req: Request, res: Response) {
    const { teacher } = req.params;

    const testsByTeacher = await testsServices.getTestsByTeacher(teacher);

    res.send(testsByTeacher).status(200);
}