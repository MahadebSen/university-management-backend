import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.get('/', AcademicDepartmentController.getAllDepartments);
router.patch(
  '/:id',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.updateDepartment
);
router.delete('/:id', AcademicDepartmentController.deleteDepartment);
router.get('/:id', AcademicDepartmentController.getSingleDepartment);
router.post(
  '/create-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createDepartment
);

export const AcademicDepartmentRoutes = router;

// route ---> validateRequest(zod schema) ---> controller
