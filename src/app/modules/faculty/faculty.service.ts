/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import { IFaculty, IFacultyFilters } from './faculty.interface';
import { FacultyModel } from './faculty.model';
import { IPaginationOption } from '../../../interfaces/pagination';
import { IGenaricResponse } from '../../../interfaces/common';
import { facultySearchableFields } from './faculty.constant';
import { paginationHelper } from '../../../helpers/paginationHelper';
import mongoose, { SortOrder } from 'mongoose';
import { UserModel } from '../user/user.model';

const getAllFaculty = async (
  filters: IFacultyFilters,
  paginationOption: IPaginationOption
): Promise<IGenaricResponse<IFaculty[]>> => {
  // Filters ----------------------------------
  const { searchTerm, ...filtersData } = filters;

  const andCodition = [];

  // {$or: [{title: {$regex: "Book 3",$options: 'i',}}]}
  if (searchTerm) {
    andCodition.push({
      $or: facultySearchableFields.map(item => ({
        // {title: {$regex: "Book 3",$options: 'i',}}
        [item]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // {$and: [{genre: "Drama"}, {title: "Book 10"}]}
  if (Object.keys(filtersData).length) {
    //*
    andCodition.push({
      // $and: [{key: value}]
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCodition.length > 0 ? { $and: andCodition } : {};

  // Pagination -------------------------------------
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const result = await FacultyModel.find(whereCondition)
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await FacultyModel.countDocuments(whereCondition);

  return {
    meta: { limit, page, total },
    data: result,
  };
};

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await FacultyModel.findById(id)
    .populate('academicDepartment')
    .populate('academicFaculty');

  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isExist = await FacultyModel.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const { name, ...facultyData } = payload;

  const updatedFacultyData: Partial<IFaculty> = { ...facultyData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await FacultyModel.findByIdAndUpdate(
    { id: id },
    updatedFacultyData,
    { new: true }
  );
  return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  // check if the faculty is exist
  const isExist = await FacultyModel.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete faculty first
    const faculty = await FacultyModel.findOneAndDelete({ id }, { session });
    if (!faculty) {
      throw new ApiError(404, 'Failed to delete faculty');
    }
    //delete user
    await UserModel.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return faculty;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const FacultyService = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
