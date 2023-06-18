import { Schema, model } from 'mongoose';
import httpStatus from 'http-status';
import {
  AcademicSemesterModelType,
  IAcademicSemester,
} from './academicSemester.interface';
import {
  academicSemesterCode,
  academicSemesterTytle,
  academicSemesterMonth,
} from './academicSemestar.constant';
import ApiError from '../../../errors/ApiErrors';

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

// Handling same year and same semester issue
academicSemesterSchema.pre('save', async function (next) {
  const isExist = await academicSemesterModel.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Academic semester is alrady exist'
    );
  }
  next();
});

export const academicSemesterModel = model<
  IAcademicSemester,
  AcademicSemesterModelType
>('AcademicSemester', academicSemesterSchema);
