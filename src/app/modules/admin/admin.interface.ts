import { Model, Types } from 'mongoose';
import { IManagementDepartment } from '../managementDepartment/managementDepartment.interface';
import { IUserBloodGroup, IUserGender } from '../user/user.interface';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IAdmin = {
  id: string;
  name: UserName;
  profileImage: string;
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  gender?: IUserGender;
  permanentAddress?: string;
  presentAddress?: string;
  bloodGroup?: IUserBloodGroup;
  managementDepartment: Types.ObjectId | IManagementDepartment;
  designation: string;
};

export type AdminModelType = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
  gender?: IUserGender;
  bloodGroup?: IUserBloodGroup;
  managementDepartment?: string;
  designation?: string;
};
