"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const database_1 = require("../src/database");
const faker_1 = require("@faker-js/faker");
const tokenFactory_1 = __importDefault(require("./factories/tokenFactory"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
beforeEach(async () => {
    await database_1.prisma.$executeRaw `TRUNCATE TABLE users`;
    await database_1.prisma.$executeRaw `TRUNCATE TABLE tests`;
});
describe('Teste rota POST /tests', () => {
    it('Deve retornar status 201 (Created) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco) e token válido no header', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        const testData = {
            name: "DrivenEats",
            pdfUrl: faker_1.faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(201);
    });
    it('Deve retornar status 401 (unauthorized) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco), mas nenhum token no header', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const testData = {
            name: "DrivenEats",
            pdfUrl: faker_1.faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/tests").send(testData);
        expect(result.status).toEqual(401);
    });
    it('Deve retornar status 400 (Invalid token) ao enviar dados válidos (com categoria, disciplina e professor(a) já cadastrados no banco), mas token inválido no header', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const payload = {
            userId: user.id
        };
        const jwtConfig = {
            expiresIn: '1d'
        };
        const token = jsonwebtoken_1.default.sign(payload, 'shiehih', jwtConfig);
        const testData = {
            name: "DrivenEats",
            pdfUrl: faker_1.faker.internet.url(),
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(400);
    });
    it('Deve retornar status 422 (validation erros) ao enviar dados inválidos (com categoria não cadastrada, tipos de dados diferentes de string ou dados faltando) e token válido no header', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        const testData = {
            name: "DrivenEats",
            pdfUrl: "example",
            category: "Projeto",
            discipline: "HTML e CSS",
            teacher: "Diego Pinho"
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar status 404 (not found) ao enviar dados válidos e token válido no header, mas cujo(a) professor(a) não corresponde à disciplina, segundo o banco de dados', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        const testData = {
            name: "DrivenEats",
            pdfUrl: faker_1.faker.internet.url(),
            category: "Projeto",
            discipline: "Planejamento",
            teacher: "Diego Pinho"
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/tests").set({ authorization: `Bearer ${token}` }).send(testData);
        expect(result.status).toEqual(404);
    });
});
beforeEach(async () => {
    await database_1.prisma.$executeRaw `TRUNCATE TABLE users`;
    await database_1.prisma.$executeRaw `TRUNCATE TABLE tests`;
});
describe('Teste rota GET /tests/discipline/:discipline', () => {
    it('Deve retornar status 200 e body do tipo array', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(result.body).toBeInstanceOf(Array);
    });
    it('Deve retornar status 401 (unauthorized) quando o token não é enviado', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/discipline/${discipline}`);
        expect(result.status).toEqual(401);
    });
    it('Deve retornar status 400 (token inválido) quando um token inválido é enviado', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = faker_1.faker.datatype.hexadecimal();
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const discipline = "html-e-css"; // "react", "javascript", "planejamento", "autoconfianca"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(400);
    });
    it('Deve retornar status 404 (not found) ao utilizar uma disciplina não cadastrada como parâmetro de rota', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const discipline = "mongo-db"; // "html-e-css", "react", "javascript", "planejamento", "autoconfianca"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/discipline/${discipline}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(404); // o throw not_found do service não está funcionando
    });
});
beforeEach(async () => {
    await database_1.prisma.$executeRaw `TRUNCATE TABLE users`;
    await database_1.prisma.$executeRaw `TRUNCATE TABLE tests`;
});
describe('Teste rota GET /tests/teacher/:teacher', () => {
    it('Deve retornar status 200 e body do tipo array', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const teacher = "diego-pinho"; // "bruna-hamori"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(result.body).toBeInstanceOf(Array);
    });
    it('Deve retornar status 401 (unauthorized) quando o token não é enviado', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const teacher = "diego-pinho"; // "bruna-hamori"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/teacher/${teacher}`);
        expect(result.status).toEqual(401);
    });
    it('Deve retornar status 400 (token inválido) quando um token inválido é enviado', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = faker_1.faker.datatype.hexadecimal();
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const teacher = "diego-pinho"; // "bruna-hamori"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(400);
    });
    it('Deve retornar status 400 (not found) quando um(a) professoro(a) não cadastrado(a) é enviado como parâmetro da rota', async () => {
        const user = await database_1.prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.random.alphaNumeric(10)
            }
        });
        const id = user.id;
        const token = await (0, tokenFactory_1.default)(id);
        await database_1.prisma.tests.create({
            data: {
                name: "DrivenEats",
                pdfUrl: faker_1.faker.internet.url(),
                categoryId: 1,
                teacherDisciplineId: 1
            }
        });
        const teacher = "laura-dias"; // "bruna-hamori" "diago-pinho"
        const result = await (0, supertest_1.default)(app_1.default).get(`/tests/teacher/${teacher}`).set({ authorization: `Bearer ${token}` });
        expect(result.status).toEqual(404);
    });
});
afterAll(async () => {
    await database_1.prisma.$disconnect();
});
