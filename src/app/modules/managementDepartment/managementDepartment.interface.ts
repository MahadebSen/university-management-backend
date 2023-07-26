import { Model } from 'mongoose';

export type IManagementDepartment = {
  title: string;
};

export type ManagementDepartmentModelType = Model<
  IManagementDepartment,
  Record<string, unknown>
>;

export type IManagementDepartmentFilters = {
  searchTerm?: string;
};
