import { z } from 'zod';

const createAcademicFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
  }),
});

const updateAcademicFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }).optional(),
  }),
});

export const academicFacultyValidation = {
  createAcademicFacultyZodSchema,
  updateAcademicFacultyZodSchema,
};
