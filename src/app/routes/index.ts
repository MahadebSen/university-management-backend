import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemestar/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { StudentRoutes } from '../modules/student/student.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
