import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();


export function tokenValidation(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers['authorization'];
    if(!auth) {
      throw { type: 'unauthorized', message: 'Missing token!' };
    } 

    const token: string = auth.split(' ')[1];
    const SECRET: string = process.env.JWT_KEY ?? '';

  try {
    jwt.verify(token, SECRET);
    const tokenData: any = jwt.verify(token, SECRET);
    res.locals.userId = tokenData.userId;
    next();
  } catch (error) {
    return res.status(400).send('Invalid token!');
  }    
    
}