import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import dotenv from 'dotenv';
import __createAuthData from './factories/authFactory';
 
dotenv.config();

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
})

describe('Testa a rota POST /sign-up', () =>{

    it('Deve retornar status 201 de Created ao enviar dados no formato válido e email ainda não cadastrado no banco', async () => {
        const signUpData = await __createAuthData();

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(201);
    })

    it('Deve retornar erro de validação caso envie uma email inválido', async () => {
        const signUpData = {
            email: 'user1gmail.com',
            password: '012sg5678dadr'
        }

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de validação caso não envie email', async () => {
        const signUpData = {
            email: '',
            password: '012sg5678dadr'
        }

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(422);
    })


    it('Deve retornar erro de validação caso não envie senha', async () => {
        const signUpData = {
            email: 'user1@gmail.com',
            password: ''
        }

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de validação caso envie senha com menos de 10 caracteres', async () => {
        const signUpData = {
            email: 'user1@gmail.com',
            password: '012sg5678'
        }

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de conflito caso envie uma email já cadastrado no banco', async () => {
        const signUpData = await __createAuthData();

        const user = await prisma.user.create({
            data: {
                email: signUpData.email,
                password: signUpData.password
            }});

        const result = await supertest(app).post("/sign-up").send(signUpData);

        expect(result.status).toEqual(409);
    })
})

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
})

describe('Testa a rota POST /sign-in', () => {
    it('Deve retornar status 200 e o token, uma string, no body ao enviar os dados corretos de um usuário já cadastrado', async () => {
        const signUpData = await __createAuthData();

        await supertest(app).post("/sign-up").send(signUpData);
        const result = await supertest(app).post("/sign-in").send(signUpData);

        expect(result.status).toEqual(200);
        expect(result.text).not.toBeNull(); 
    })

    it('Deve retornar erro de validação caso envie uma email inválido', async () => {
        const signInData = {
            email: 'user1gmail.com',
            password: '012sg5678dadr'
        }

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de validação caso não envie email', async () => {
        const signInData = {
            email: '',
            password: '012sg5678dadr'
        }

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de validação caso não envie senha', async () => {
        const signInData = {
            email: 'user1@gmail.com',
            password: ''
        }

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro de validação caso envie senha com menos de 10 caracteres', async () => {
        const signInData = {
            email: 'user1@gmail.com',
            password: '012sg5678'
        }

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(422);
    })

    it('Deve retornar erro do tipo unauthorized, ao enviar dados que não estejam cadastrados na tabela users', async () => {
        const signInData = await __createAuthData();

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(401);
    })

    it('Deve retornar erro do tipo unauthorized, ao enviar um email cadastrado com senha incorreta', async () => {
        const signUpData = await __createAuthData();
        await supertest(app).post("/sign-up").send(signUpData);

        const signInData = {
            email: signUpData.email,
            password: 'serfaheo290044'
        }

        const result = await supertest(app).post("/sign-in").send(signInData);

        expect(result.status).toEqual(401);
    })

    
})


afterAll( async () => {
    await prisma.$disconnect();
})