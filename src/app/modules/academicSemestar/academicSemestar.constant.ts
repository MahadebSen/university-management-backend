import {
  IAcademicSemesterCode,
  IAcademicSemesterMonths,
  IAcademicSemesterTytle,
} from './academicSemester.interface';

export const academicSemesterTytle: IAcademicSemesterTytle[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const academicSemesterCode: IAcademicSemesterCode[] = ['01', '02', '03'];

export const academicSemesterMonth: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemestarSearchableFields = ['title', 'code', 'year'];

export const academicSemestarFiltelableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
];
