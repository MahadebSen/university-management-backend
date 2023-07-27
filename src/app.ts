import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

const app: Application = express();

// using cors
app.use(cors());

// using cookie-perser
app.use(cookieParser());

// parseing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routers);

// testing
app.get('/', async (req: Request, res: Response) => {
  res.send('Hii from University-management-backend');
});

// global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });

  next();
});

export default app;
