import { Schema, model } from 'mongoose';
import {
  IAcademicDepartment,
  AcademicDepartmentModelType,
} from './academicDepartment.interface';

export const academicDepartmentSchema = new Schema<
  IAcademicDepartment,
  AcademicDepartmentModelType
>(
  {
    title: { type: String, required: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const AcademicDepartmentModel = model<
  IAcademicDepartment,
  AcademicDepartmentModelType
>('AcademicDepartment', academicDepartmentSchema);
