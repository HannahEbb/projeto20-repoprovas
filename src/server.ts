import dotenv from 'dotenv';
import app from './app';
dotenv.config({ path: '.env' });

const port = Number(process.env.PORT) || 4003;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});