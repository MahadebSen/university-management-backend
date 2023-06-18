import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import { academicSemesterTitleCodeMapper } from './academicSemestar.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';
// import { IPaginationOption } from '../../../interfaces/pagination';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester | null> => {
  const result = await academicSemesterModel.create(payload);

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

// const getAllSemester = async (paginationOption: IPaginationOption): Promise<IAcademicSemester[]> => {
//   const result = await academicSemesterModel.find({});

//   return result;
// };
const getAllSemester = async (): Promise<IAcademicSemester[]> => {
  const result = await academicSemesterModel.find({});

  return result;
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemester,
};
