import { FacultyModelType, IFaculty } from './faculty.interface';
import { bloodGroup, gender } from '../user/user.constant';
import { Schema, model } from 'mongoose';

const facultySchema = new Schema<IFaculty, FacultyModelType>(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: {
        firstName: { type: String, required: true },
        middleName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: gender },
    bloodGroup: { type: String, enum: bloodGroup },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    designation: { type: String, required: true },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    profileImage: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const FacultyModel = model<IFaculty, FacultyModelType>(
  'Faculty',
  facultySchema
);
