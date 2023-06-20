import { z } from 'zod';
import {
  academicSemesterCode,
  academicSemesterTytle,
  academicSemesterMonth,
} from './academicSemestar.constant';

const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum([...academicSemesterTytle] as [string, ...string[]], {
      required_error: 'Title is required',
    }),
    year: z.string({ required_error: 'Year is required' }),
    code: z.enum([...academicSemesterCode] as [string, ...string[]], {
      required_error: 'Code is required',
    }),
    startMonth: z.enum([...academicSemesterMonth] as [string, ...string[]], {
      required_error: 'Start month is required',
    }),
    endMonth: z.enum([...academicSemesterMonth] as [string, ...string[]], {
      required_error: 'End month is required',
    }),
  }),
});

export const academicSemesterValidation = {
  createAcademicSemesterZodSchema,
};
