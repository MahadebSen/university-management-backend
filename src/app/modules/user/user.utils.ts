import { IAcademicSemester } from '../academicSemestar/academicSemester.interface';
import { UserModel } from './user.model';

// Finding last Ids ---------------------------
export const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
};

export const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// Generating Ids -------------------------------
export const generateStudentId = async (
  academicSemester: IAcademicSemester | null
): Promise<string | null> => {
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, '0'); // 00000

  // increment ID by 1
  if (academicSemester) {
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0'); // 0+1 --> 1 --> 00001
    incrementedId = `${academicSemester.year.substring(2)}${
      academicSemester.code
    }${incrementedId}`;
    return incrementedId;
  }

  return null;
};

export const generateFacultyId = async () => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0'); // 00000
  // increment ID by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0'); // 0+1 --> 1 --> 00001
  incrementedId = `F-${incrementedId}`;
  return incrementedId;
};
