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

// Ensure 01: route lavel: --> update --> Give me title and code both,
const updateAcademicSemesterZodSchema = z
  .object({
    body: z.object({
      title: z
        .enum([...academicSemesterTytle] as [string, ...string[]])
        .optional(),
      year: z.string().optional(),
      code: z
        .enum([...academicSemesterCode] as [string, ...string[]])
        .optional(),
      startMonth: z
        .enum([...academicSemesterMonth] as [string, ...string[]])
        .optional(),
      endMonth: z
        .enum([...academicSemesterMonth] as [string, ...string[]])
        .optional(),
    }),
  })
  .refine(
    data =>
      (data.body.title && data.body.code) ||
      (!data.body.title && !data.body.code),
    { message: 'Either title and code should be provided or neither' }
  );

export const academicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
