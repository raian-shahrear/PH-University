import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// application route
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to PH University!');
});

// application middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
