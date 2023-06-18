import { NextFunction, Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

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
    // const paginationOption = {
    //   page: Number(req.query.page),
    //   limit: Number(req.query.limit),
    //   sortBy: req.query.sortBy,
    //   sortOrder: req.query.sortOrder,
    // };
    // Or,
    const paginationOption = pick(req.query, paginationFields);

    const result = await AcademicSemesterService.getAllSemester(
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

export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
};
