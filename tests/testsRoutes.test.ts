import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import { faker } from '@faker-js/faker';
import __createAuthData from './factories/authFactory';
import __createToken from './factories/tokenFactory';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();


beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
    await prisma.$executeRaw`TRUNCATE TABLE tests`;
})


describe('Teste rota POST /tests', () => {

    it('Deve retornar status 201 (Created) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco) e token válido no header', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
            const token = await __createToken(id);

        const testData = {
            name: "DrivenEats",
            pdfUrl: faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
          }

        const result = await supertest(app).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(201);
    })

    it('Deve retornar status 401 (unauthorized) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco), mas nenhum token no header', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});

        const testData = {
            name: "DrivenEats",
            pdfUrl: faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
          }

        const result = await supertest(app).post("/tests").send(testData);
        expect(result.status).toEqual(401);
    })

    it('Deve retornar status 400 (Invalid token) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco), mas token inválido no header', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
    
            const payload = {
                userId: user.id 
            };
            const jwtConfig = {
                expiresIn: '1d'
              };
        
            const token = jwt.sign(payload, 'shiehih', jwtConfig); 

        const testData = {
            name: "DrivenEats",
            pdfUrl: faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
          }

        const result = await supertest(app).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(400);
    })

    it('Deve retornar status 422 (validation erros) ao enviar dados inválidos (com categoria não cadastrada, tipos de dados diferentes de string ou dados faltando) e token válido no header', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
    
            const id = user.id;
            const token = await __createToken(id);

        const testData = {
            name: "DrivenEats",
            pdfUrl: "example",
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
          }

        const result = await supertest(app).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(422);
    })

    it('Deve retornar status 404 (not found) ao enviar dados válidos e token válido no header, mas cujo(a) professor(a) não corresponde à disciplina, segundo o banco de dados', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
    
            const id = user.id;
            const token = await __createToken(id); 

        const testData = {
            name: "DrivenEats",
            pdfUrl: faker.internet.url(),
            category: "Projeto",
            discipline: "Planejamento",
            teacher: "Diego Pinho"
          }

        const result = await supertest(app).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(404);
    })
})

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
    await prisma.$executeRaw`TRUNCATE TABLE tests`;
})

describe('Teste rota GET /tests/discipline/:discipline', () => {
  it('Deve retornar status 200 e body do tipo array', async () => {
    const user = await prisma.user.create({
        data: {
            email: faker.internet.email(),
            password: faker.random.alphaNumeric(10)
        }});
        const id = user.id;
        const token = await __createToken(id);

    await prisma.tests.create({
        data: {
            name: "DrivenEats",
            pdfUrl: faker.internet.url(),
            categoryId: 1,
            teacherDisciplineId: 1
        }});

        const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"

        const result = await supertest(app).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(result.body).toBeInstanceOf(Array);

    })

    it('Deve retornar status 401 (unauthorized) quando o token não é enviado', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
    
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
    
            const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"
    
            const result = await supertest(app).get(`/tests/discipline/${discipline}`);
            expect(result.status).toEqual(401);
           
    })

    it('Deve retornar status 400 (token inválido) quando um token inválido é enviado', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
            const token = faker.datatype.hexadecimal();
    
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
    
            const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"
    
            const result = await supertest(app).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
            expect(result.status).toEqual(400);
    })

    it('Deve retornar status 404 (not found) ao utilizar uma disciplina não cadastrada como parâmetro de rota', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
            const token = await __createToken(id);
    
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
    
            const discipline = "mongo-db"; // "html-e-css", "react", "javascript", "planejamento", "autoconfianca"
    
            const result = await supertest(app).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
            expect(result.status).toEqual(404); // o throw not_found do service não está funcionando
    
        })
})

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
    await prisma.$executeRaw`TRUNCATE TABLE tests`;
})


describe('Teste rota GET /tests/teacher/:teacher', () => {
    it('Deve retornar status 200 e body do tipo array', async () => {
      const user = await prisma.user.create({
          data: {
              email: faker.internet.email(),
              password: faker.random.alphaNumeric(10)
          }});
          const id = user.id;
          const token = await __createToken(id);
  
      await prisma.tests.create({
          data: {
              name: "DrivenEats",
              pdfUrl: faker.internet.url(),
              categoryId: 1,
              teacherDisciplineId: 1
          }});
  
          const teacher = "diego-pinho"; // "bruna-hamori"
  
          const result = await supertest(app).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
          expect(result.status).toEqual(200);
          expect(result.body).toBeInstanceOf(Array);
  
      })

    it('Deve retornar status 401 (unauthorized) quando o token não é enviado', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
    
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
    
            const teacher = "diego-pinho"; // "bruna-hamori"
    
            const result = await supertest(app).get(`/tests/teacher/${teacher}`);
            expect(result.status).toEqual(401);
    
        })
    
    it('Deve retornar status 400 (token inválido) quando um token inválido é enviado', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
            const token = faker.datatype.hexadecimal();
        
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
        
            const teacher = "diego-pinho"; // "bruna-hamori"
        
            const result = await supertest(app).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
            expect(result.status).toEqual(400);
        
        })

    it('Deve retornar status 400 (not found) quando um(a) professoro(a) não cadastrado(a) é enviado como parâmetro da rota', async () => {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(10)
            }});
            const id = user.id;
            const token = await __createToken(id);
        
        await prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }});
        
            const teacher = "laura-dias"; // "bruna-hamori" "diago-pinho"
        
            const result = await supertest(app).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
            expect(result.status).toEqual(404);
        
            })  
 
  })



afterAll( async () => {
    await prisma.$disconnect();
})