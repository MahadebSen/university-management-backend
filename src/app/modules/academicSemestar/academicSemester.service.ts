import ApiError from '../../../errors/ApiErrors';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester | null> => {
  const result = await academicSemesterModel.create(payload);
  if (!result) {
    throw new ApiError(400, 'Failed to create semester');
  } else {
    return result;
  }
};

export const AcademicSemesterService = {
  createSemester,
};
