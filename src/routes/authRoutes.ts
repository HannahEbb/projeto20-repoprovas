import { Router } from 'express';
import { schemaValidator } from '../middlewares/schemaValidator';
import signUpSchema from '../schemas/signUpSchema';
import signInSchema from '../schemas/signInSchema';
import { signUp, signIn } from '../controllers/authControllers';


const authRouter = Router();

authRouter.post('/sign-up', schemaValidator(signUpSchema), signUp);
authRouter.post('/sign-in', schemaValidator(signInSchema), signIn);

export default authRouter;