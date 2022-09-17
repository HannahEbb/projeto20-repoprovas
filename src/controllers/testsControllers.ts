import { Request, Response } from 'express';
import * as testsServices from "../services/testsServices";


export async function newTest(req: Request, res: Response) {
    const { name, pdfUrl, category, discipline, teacher } = req.body;
    await testsServices.create(name, pdfUrl, category, discipline, teacher);

    res.sendStatus(201); 
}