import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import {
  academicSemestarSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemestar.constant';
import {
  IAcademicSemester,
  IAcademicSemesterFilters,
} from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';
import { IGenaricResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemesterModel.create(payload);

  // Summer --> 02 !== 03
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid semester code');
  }

  if (!result) {
    throw new ApiError(400, 'Failed to create semester');
  } else {
    return result;
  }
};

const getAllSemester = async (
  filters: IAcademicSemesterFilters,
  paginationOption: IPaginationOption
): Promise<IGenaricResponse<IAcademicSemester[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCodition = [];

  if (searchTerm) {
    andCodition.push({
      $or: academicSemestarSearchableFields.map(item => ({
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

  /*
  andCodition.push({
      $or: [
        {
          title: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          code: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ],
    });
  */

  // const { page = 1, limit = 10 } = paginationOption;
  // const skip = (page - 1) * limit;
  // Or,
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const result = await AcademicSemesterModel.find(whareCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await AcademicSemesterModel.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemesterModel.findById(id);

  return result;
};

const updateSemester = async (
  id: string,
  payload: Partial<IAcademicSemester>
): Promise<IAcademicSemester | null> => {
  // Summer --> 02 !== 03
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid semester code');
  }
  const result = await AcademicSemesterModel.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true }
  );

  return result;
};

const deleteSemester = async (id: string) => {
  const result = AcademicSemesterModel.findByIdAndDelete({ _id: id });

  return result;
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
