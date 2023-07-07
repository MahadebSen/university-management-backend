import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiErrors';
import { AcademicSemesterModel } from '../academicSemestar/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';
import { StudentModel } from '../student/student.model';
import httpStatus from 'http-status';

const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // Default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }

  // Set role
  user.role = 'student';

  // Generate incremental Id
  const academicSemester = await AcademicSemesterModel.findById(
    student.academicSemester
  );

  let newUserAllData = null;

  const season = await mongoose.startSession();
  try {
    season.startTransaction();
    const id = await generateStudentId(academicSemester);
    if (id) {
      user.id = id;
      student.id = id;
    }

    const createStudent = await StudentModel.create([student], { season });
    if (!createStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a student');
    }

    const createUser = await UserModel.create([user], { season });
    user.student = createStudent[0]._id;
    if (!createUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a user');
    }

    newUserAllData = createUser[0];

    await season.commitTransaction();
    await season.endSession();
  } catch (error) {
    await season.abortTransaction();
    await season.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = UserModel.findOne({ id: newUserAllData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    });
  }

  return newUserAllData;
};

export const UserService = {
  createStudent,
};
