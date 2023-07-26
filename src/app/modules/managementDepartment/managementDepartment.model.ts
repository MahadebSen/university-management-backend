import { Schema, model } from 'mongoose';
import {
  IManagementDepartment,
  ManagementDepartmentModelType,
} from './managementDepartment.interface';

const managementDepartmentSchema = new Schema<
  IManagementDepartment,
  ManagementDepartmentModelType
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ManagementDepartmentModel = model<
  IManagementDepartment,
  ManagementDepartmentModelType
>('ManagementDepartment', managementDepartmentSchema);
