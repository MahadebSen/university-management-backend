import ApiError from '../../../errors/ApiErrors';
import { IGenaricResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagination';
import {
  IAcademicDepartment,
  IAcademicDepartmentFilters,
} from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createDepartment = async (
  payload: IAcademicDepartment
): Promise<IAcademicDepartment | null> => {
  const result = (await AcademicDepartmentModel.create(payload)).populate(
    'academicFaculty'
  );

  if (!result) {
    throw new ApiError(400, 'Failed to create department');
  } else {
    return result;
  }
};

const getAllDepartment = async (
  filters: IAcademicDepartmentFilters,
  paginationOption: IPaginationOption
): Promise<IGenaricResponse<IAcademicDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCodition = [];

  if (searchTerm) {
    andCodition.push({
      $or: academicDepartmentSearchableFields.map(item => ({
        [item]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCodition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whareCondition = andCodition.length > 0 ? { $and: andCodition } : {};

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const result = await AcademicDepartmentModel.find(whareCondition)
    .populate('AcademicFaculty')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await AcademicDepartmentModel.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDepartment = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  const result = await AcademicDepartmentModel.findById(id).populate(
    'AcademicFaculty'
  );

  return result;
};

const updateDepartment = async (
  id: string,
  payload: Partial<IAcademicDepartment>
): Promise<IAcademicDepartment | null> => {
  const result = await AcademicDepartmentModel.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true }
  ).populate('AcademicFaculty');

  return result;
};

const deleteDepartment = async (id: string) => {
  const result = AcademicDepartmentModel.findByIdAndDelete({ _id: id });

  return result;
};

export const AcademicDepartmentService = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
