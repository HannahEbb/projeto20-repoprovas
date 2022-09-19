"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const database_1 = require("../src/database");
const dotenv_1 = __importDefault(require("dotenv"));
const authFactory_1 = __importDefault(require("./factories/authFactory"));
dotenv_1.default.config();
beforeEach(async () => {
    await database_1.prisma.$executeRaw `TRUNCATE TABLE users`;
});
describe('Testa a rota POST /sign-up', () => {
    it('Deve retornar status 201 de Created ao enviar dados no formato válido e email ainda não cadastrado no banco', async () => {
        const signUpData = await (0, authFactory_1.default)();
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(201);
    });
    it('Deve retornar erro de validação caso envie uma email inválido', async () => {
        const signUpData = {
            email: 'user1gmail.com',
            password: '012sg5678dadr'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso não envie email', async () => {
        const signUpData = {
            email: '',
            password: '012sg5678dadr'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso não envie senha', async () => {
        const signUpData = {
            email: 'user1@gmail.com',
            password: ''
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso envie senha com menos de 10 caracteres', async () => {
        const signUpData = {
            email: 'user1@gmail.com',
            password: '012sg5678'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de conflito caso envie uma email já cadastrado no banco', async () => {
        const signUpData = await (0, authFactory_1.default)();
        const user = await database_1.prisma.user.create({
            data: {
                email: signUpData.email,
                password: signUpData.password
            }
        });
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        expect(result.status).toEqual(409);
    });
});
beforeEach(async () => {
    await database_1.prisma.$executeRaw `TRUNCATE TABLE users`;
});
describe('Testa a rota POST /sign-in', () => {
    it('Deve retornar status 200 e o token, uma string, no body ao enviar os dados corretos de um usuário já cadastrado', async () => {
        const signUpData = await (0, authFactory_1.default)();
        await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signUpData);
        expect(result.status).toEqual(200);
        expect(result.text).not.toBeNull();
    });
    it('Deve retornar erro de validação caso envie uma email inválido', async () => {
        const signInData = {
            email: 'user1gmail.com',
            password: '012sg5678dadr'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso não envie email', async () => {
        const signInData = {
            email: '',
            password: '012sg5678dadr'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso não envie senha', async () => {
        const signInData = {
            email: 'user1@gmail.com',
            password: ''
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro de validação caso envie senha com menos de 10 caracteres', async () => {
        const signInData = {
            email: 'user1@gmail.com',
            password: '012sg5678'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(422);
    });
    it('Deve retornar erro do tipo unauthorized, ao enviar dados que não estejam cadastrados na tabela users', async () => {
        const signInData = await (0, authFactory_1.default)();
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(401);
    });
    it('Deve retornar erro do tipo unauthorized, ao enviar um email cadastrado com senha incorreta', async () => {
        const signUpData = await (0, authFactory_1.default)();
        await (0, supertest_1.default)(app_1.default).post("/sign-up").send(signUpData);
        const signInData = {
            email: signUpData.email,
            password: 'serfaheo290044'
        };
        const result = await (0, supertest_1.default)(app_1.default).post("/sign-in").send(signInData);
        expect(result.status).toEqual(401);
    });
});
afterAll(async () => {
    await database_1.prisma.$disconnect();
});
