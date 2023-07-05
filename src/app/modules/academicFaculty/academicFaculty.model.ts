import { Schema, model } from 'mongoose';
import {
  AcademicFacultyModelType,
  IAcademicFaculty,
} from './academicFaculty.interface';

export const academicFacultySchema = new Schema<
  IAcademicFaculty,
  AcademicFacultyModelType
>(
  {
    title: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const academicFacultyModel = model<
  IAcademicFaculty,
  AcademicFacultyModelType
>('AcademicFaculty', academicFacultySchema);
