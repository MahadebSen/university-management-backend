import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiErrors';
import { AcademicSemesterModel } from '../academicSemestar/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import { StudentModel } from '../student/student.model';
import httpStatus from 'http-status';
import { FacultyModel } from '../faculty/faculty.model';
import { IFaculty } from '../faculty/faculty.interface';

const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // Default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
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

const createFaculty = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  // Default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  // Set role
  user.role = 'faculty';

  // Generate incremental Id
  let newUserAllData = null;

  const season = await mongoose.startSession();
  try {
    season.startTransaction();
    const id = await generateFacultyId();
    if (id) {
      user.id = id;
      faculty.id = id;
    }

    const createFaculty = await FacultyModel.create([faculty], { season });
    if (!createFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a faculty');
    }

    const createUser = await UserModel.create([user], { season });
    if (!createUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a user');
    }

    user.faculty = createFaculty[0]._id;

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
      path: 'faculty',
      populate: [
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
  createFaculty,
};
