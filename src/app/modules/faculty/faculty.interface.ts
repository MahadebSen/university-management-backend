import { Model, Types } from 'mongoose';
import { IUserBloodGroup, IUserGender } from '../user/user.interface';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';

export type UserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type IFaculty = {
  id: string;
  name: UserName; //embedded object
  dateOfBirth: string;
  gender: IUserGender;
  bloodGroup: IUserBloodGroup;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  designation: string;
  academicDepartment: Types.ObjectId | IAcademicDepartment; // reference _id
  academicFaculty: Types.ObjectId | IAcademicFaculty; // reference _id
  profileImage?: string;
};

export type FacultyModelType = Model<IFaculty, Record<string, unknown>>;

export type IFacultyFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  contactNo?: string;
};
