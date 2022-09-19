import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export default async function __createToken(id: number) {
    const SECRET: string = process.env.JWT_KEY ?? '';
    const EXPIRES_IN = process.env.EXPIRES_IN;

    const payload = {
        userId: id 
        };

    const jwtConfig = {
       expiresIn: EXPIRES_IN
        };
        
    const token = jwt.sign(payload, SECRET, jwtConfig);

    return token;
}