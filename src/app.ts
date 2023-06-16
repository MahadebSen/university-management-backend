import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// application routes
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { AcademicSemesterRoutes } from './app/modules/academicSemestar/academicSemester.route';
// import ApiError from './errors/ApiErrors'

const app: Application = express();

// using cors
app.use(cors());

// parseing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/academic-semesters', AcademicSemesterRoutes);

// testing
app.get('/', async (req: Request, res: Response) => {
  res.send('Hii from University-management-backend');
  // throw new ApiError(404, 'hiii dady')
  // Promise.reject(new Error('oiii'))
});

// global error handler
app.use(globalErrorHandler);

export default app;
