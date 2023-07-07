import { IStudentBloodGroup, IStudentGender } from './student.interface';

export const gender: IStudentGender[] = ['male', 'female', 'others'];
export const bloodGroup: IStudentBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
];

export const studentSearchableFields = [
  'id',
  'bloodGroup',
  'email',
  'contactNo',
  'name.firstName',
  'name.middleName',
  'name.lastName',
];

export const studentFiltelableFields = [
  'searchTerm',
  'id',
  'bloodGroup',
  'email',
  'contactNo',
  // 'name.firstName',
  // 'name.middleName',
  // 'name.lastName',
];
