import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { academicSemestarFiltelableFields } from './academicSemestar.constant';
import { IAcademicSemester } from './academicSemester.interface';

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const { ...academicSemester } = await req.body;
  const result = await AcademicSemesterService.createSemester(academicSemester);

  // res.status(200).json({
  //   success: true,
  //   message: 'Successfully created academic semester!',
  //   data: result,
  // });
  // Or,
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester created successfilly!',
    data: result,
  });
});

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const paginationOption = pick(req.query, paginationFields);
  const filters = pick(req.query, academicSemestarFiltelableFields);

  const result = await AcademicSemesterService.getAllSemester(
    filters,
    paginationOption
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AcademicSemesterService.getSingleSemester(id);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    data: result,
  });
});

const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await AcademicSemesterService.updateSemester(id, payload);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester updated successfully!',
    data: result,
  });
});

const deleteSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AcademicSemesterService.deleteSemester(id);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester deleted successfully!',
    data: result,
  });
});

export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
