import { prisma } from '../database';
import { IAuthData } from '../types/authTypes';

export async function findByEmail(email: string) {
    const result = await prisma.user.findUnique({ where: { email } }); 
    return result;
}

export async function insert(signUpData: IAuthData) {
   await prisma.user.create({ data: signUpData });
} 