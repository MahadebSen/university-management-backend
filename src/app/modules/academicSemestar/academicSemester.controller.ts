import { RequestHandler } from 'express';
import { AcademicSemesterService } from './academicSemester.service';

const createSemester: RequestHandler = async (req, res, next) => {
  try {
    const { ...academicSemester } = await req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemester
    );

    res.status(200).json({
      success: true,
      message: 'Successfully created academic semester!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AcademicSemesterController = {
  createSemester,
};
