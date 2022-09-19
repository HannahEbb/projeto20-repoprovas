import { faker } from '@faker-js/faker';

export default async function __createAuthData() {
    const authData = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10).toString()
    }
    return authData;
}