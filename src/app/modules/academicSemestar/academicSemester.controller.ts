import { NextFunction, Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { academicSemestarFiltelableFields } from './academicSemestar.constant';
import { IAcademicSemester } from './academicSemester.interface';

const createSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemester } = await req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemester
    );

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

    next();
  }
);

const getAllSemesters = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    next();
  }
);

const getSingleSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AcademicSemesterService.getSingleSemester(id);

    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: '',
      data: result,
    });
    next();
  }
);

const updateSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await AcademicSemesterService.updateSemester(id, payload);

    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester updated successfully!',
      data: result,
    });
    next();
  }
);

export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
};
