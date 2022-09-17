import * as authRepositories from '../repositories/authRepositories';
import { hashSync, compareSync } from 'bcrypt';
import { IAuthData } from '../types/authTypes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();



export async function create(email: string, password: string) {
    const emailIsRegistered = await authRepositories.findByEmail(email); 
    if(emailIsRegistered) {
        throw { type: 'conflict', message: 'This email already exists!' };
    }

    const hashPassword = hashSync(password, Number(process.env.HASH_SECRET));

    const signUpData = {email, password: hashPassword}

    await authRepositories.insert(signUpData);

}

export async function login(signInData: IAuthData) {
    const { email, password } = signInData;
    const emailIsRegistered = await authRepositories.findByEmail(email) 
    if(!emailIsRegistered) {
        throw { type: 'unauthorized', message: 'Incorrect email or password!' };
    }
 
    const passwordCrypt = compareSync(password, emailIsRegistered.password); 
    if(!passwordCrypt) {
        throw { type: 'unauthorized', message: 'Incorrect email or password!!' };
    }

    const SECRET: string = process.env.JWT_KEY ?? '';
    const EXPIRES_IN = process.env.EXPIRES_IN;

    const payload = {
        userId: emailIsRegistered.id 
    };

    const jwtConfig = {
        expiresIn: EXPIRES_IN
      };

    const token = jwt.sign(payload, SECRET, jwtConfig); 
    
    return token;
}