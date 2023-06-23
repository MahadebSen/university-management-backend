import express from 'express';
import { AcademicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.get('/', AcademicFacultyController.getAllFaculties);
router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  AcademicFacultyController.updateFaculty
);
router.delete('/:id', AcademicFacultyController.deleteFaculty);
router.get('/:id', AcademicFacultyController.getSingleFaculty);
router.post(
  '/create-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyZodSchema),
  AcademicFacultyController.createFaculty
);

export const AcademicFacultyRoutes = router;

// route ---> validateRequest(zod schema) ---> controller
