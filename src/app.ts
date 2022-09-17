import cors from 'cors';
import express, { json } from 'express';
import 'express-async-errors';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import authRouter from './routes/authRoutes';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const app = express();
app.use(json());
app.use(cors());
app.use(authRouter);
app.use(errorHandlerMiddleware);

const port = Number(process.env.PORT) || 4003;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

