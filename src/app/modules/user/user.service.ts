import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiErrors';
import { AcademicSemesterModel } from '../academicSemestar/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { UserModel } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import { StudentModel } from '../student/student.model';
import httpStatus from 'http-status';
import { FacultyModel } from '../faculty/faculty.model';
import { IFaculty } from '../faculty/faculty.interface';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

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
    user.student = createStudent[0]._id;
    if (!createStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a student');
    }

    const createUser = await UserModel.create([user], { season });
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
    user.faculty = createFaculty[0]._id;
    if (!createFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to create a faculty');
    }

    const createUser = await UserModel.create([user], { season });
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

const createAdmin = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  // set role
  user.role = 'admin';

  // generate faculty id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const id = await generateAdminId();
    user.id = id;
    admin.id = id;

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty ');
    }

    user.admin = newAdmin[0]._id;

    const newUser = await UserModel.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await UserModel.findOne({
      id: newUserAllData.id,
    }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    });
  }

  return newUserAllData;
};

export const UserService = {
  createStudent,
  createFaculty,
  createAdmin,
};
