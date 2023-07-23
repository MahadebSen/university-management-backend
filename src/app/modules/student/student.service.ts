/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenaricResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagination';
import { studentSearchableFields } from './student.constant';
import { IStudent, IStudentFilters } from './student.interface';
import { StudentModel } from './student.model';
import ApiError from '../../../errors/ApiErrors';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';

const getAllStudent = async (
  filters: IStudentFilters,
  paginationOption: IPaginationOption
): Promise<IGenaricResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCodition = [];

  // {$or: [{title: {$regex: "Book 3",$options: 'i',}}]}
  if (searchTerm) {
    // {$or: [{title: {$regex: "Book 3",$options: 'i',}}]}
    andCodition.push({
      $or: studentSearchableFields.map(item => ({
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
    andCodition.push({
      // $and: [{key: value}]
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  /*{
    $and: [
      {
        $or: [
          { title: { $regex: 'Book 3', $options: 'i' } },
        ],
      },
      { 
        $and: [
          { genre: 'Fantasy' }
        ] 
      },
    ];
  }*/
  const whareCondition = andCodition.length > 0 ? { $and: andCodition } : {};

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const result = await StudentModel.find(whareCondition)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await StudentModel.countDocuments(whareCondition);

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
  const result = await StudentModel.findById(id)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty');

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  const isExist = await StudentModel.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  const { name, guardian, localGuardian, ...studentData } = payload;

  const updatedStudentData: Partial<IStudent> = { ...studentData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>; // `name.firstName`
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `guardian.${key}` as keyof Partial<IStudent>; // `guardian.fisrtguardian`
      (updatedStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian]; // updatedStudentData['guardian.motherContactNo']=guardian[motherContactNo]
      // updatedStudentData --> object create --> guardian : { motherContactNo: 0177}
    });
  }
  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const localGuardianKey =
        `localGuardian.${key}` as keyof Partial<IStudent>; // `localGuardian.fisrtName`
      (updatedStudentData as any)[localGuardianKey] =
        localGuardian[key as keyof typeof localGuardian];
    });
  }

  const result = await StudentModel.findByIdAndUpdate(
    { id: id },
    updatedStudentData,
    {
      new: true,
    }
  );

  return result;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  // check if the student is exist
  const isExist = await StudentModel.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete student first
    const student = await StudentModel.findOneAndDelete({ id }, { session });
    if (!student) {
      throw new ApiError(404, 'Failed to delete student');
    }
    //delete user
    await UserModel.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return student;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const StudentService = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
