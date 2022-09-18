import { Router } from 'express';
import { tokenValidation } from '../middlewares/tokenValidator';
import { schemaValidator } from '../middlewares/schemaValidator';
import testSchema from '../schemas/testSchema';
import { writeNewTest, readTestsByDiscipline, readTestsByTeacher } from '../controllers/testsControllers';

const testsRouter = Router();

testsRouter.post('/tests', schemaValidator(testSchema), tokenValidation, writeNewTest); //schemaValidator(testSchema)
testsRouter.get('/tests/:discipline', tokenValidation, readTestsByDiscipline);
testsRouter.get('/tests/:teacher', tokenValidation, readTestsByTeacher);


export default testsRouter;