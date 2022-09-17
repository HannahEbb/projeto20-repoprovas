import { Tests } from "@prisma/client";


export type ITestData = Omit<Tests, 'id'>