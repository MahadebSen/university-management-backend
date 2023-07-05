import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenaricResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagination';
import { studentSearchableFields } from './student.constant';
import { IStudent, IStudentFilters } from './student.interface';
import { studentModel } from './student.model';

const getAllStudent = async (
  filters: IStudentFilters,
  paginationOption: IPaginationOption
): Promise<IGenaricResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCodition = [];

  if (searchTerm) {
    andCodition.push({
      $or: studentSearchableFields.map(item => ({
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

  const result = await studentModel
    .find(whareCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await studentModel.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await studentModel.findById(id);

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  // Summer --> 02 !== 03
  // if (
  //   payload.title &&
  //   payload.code &&
  //   academicSemesterTitleCodeMapper[payload.title] !== payload.code
  // ) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid semester code');
  // }
  const result = await studentModel.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteStudent = async (id: string) => {
  const result = studentModel.findByIdAndDelete({ _id: id });

  return result;
};

export const StudentService = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
