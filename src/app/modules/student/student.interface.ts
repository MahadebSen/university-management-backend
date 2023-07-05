import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';
import { IAcademicSemester } from '../academicSemestar/academicSemester.interface';

export type IStudentGender = 'male' | 'female' | 'others';
export type IStudentBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'O+'
  | 'O-'
  | 'AB+'
  | 'AB-';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
  address: string;
};

export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type IStudent = {
  id: string;
  name: UserName; //embedded object
  gender: IStudentGender;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: IStudentBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian; // embedded object
  localGuardian: LocalGuardian; // embedded object
  academicFaculty: Types.ObjectId | IAcademicFaculty; // reference _id
  academicDepartment: Types.ObjectId | IAcademicDepartment; // // reference _id
  academicSemester: Types.ObjectId | IAcademicSemester; // reference _id
  profileImage?: string;
};

export type StudentModelType = Model<IStudent, Record<string, unknown>>;

export type IStudentFilters = {
  searchTerm?: string;
};
