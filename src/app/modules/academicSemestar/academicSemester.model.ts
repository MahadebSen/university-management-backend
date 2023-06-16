import { Schema, model } from 'mongoose';
import {
  AcademicSemesterModelType,
  IAcademicSemester,
} from './academicSemester.interface';
import {
  academicSemesterCode,
  academicSemesterTytle,
  academicSemesterMonth,
} from './academicSemestar.constant';

export const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    title: { type: String, required: true, enum: academicSemesterTytle },
    year: { type: Number, required: true },
    code: { type: String, required: true, enum: academicSemesterCode },
    startMonth: { type: String, required: true, enum: academicSemesterMonth },
    endMonth: { type: String, required: true, enum: academicSemesterMonth },
  },
  {
    // createdAt and updatedAt
    timestamps: true,
  }
);

export const academicSemesterModel = model<
  IAcademicSemester,
  AcademicSemesterModelType
>('AcademicSemester', academicSemesterSchema);
