import cors from 'cors';
import express, { json } from 'express';
import 'express-async-errors';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import authRouter from './routes/authRoutes';
import testsRouter from './routes/testsRouter';


const app = express();
app.use(json());
app.use(cors());
app.use(authRouter);
app.use(testsRouter);
app.use(errorHandlerMiddleware);

export default app;

