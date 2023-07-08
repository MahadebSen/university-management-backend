import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { FacultyService } from './faculty.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IFaculty } from './faculty.interface';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { facultyFiltelableFields } from './faculty.constant';

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const paginationOption = pick(req.query, paginationFields);
  const filters = pick(req.query, facultyFiltelableFields);

  const result = await FacultyService.getAllFaculty(filters, paginationOption);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FacultyService.getSingleFaculty(id);

  sendResponse<IFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await FacultyService.updateFaculty(id, payload);

  sendResponse<IFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully',
    data: result,
  });
});

export const FacultyController = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
};
