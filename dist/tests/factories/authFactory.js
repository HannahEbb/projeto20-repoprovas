"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
async function __createAuthData() {
    const authData = {
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.random.alphaNumeric(10).toString()
    };
    return authData;
}
exports.default = __createAuthData;
