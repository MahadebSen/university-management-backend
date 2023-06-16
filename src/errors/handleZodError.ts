import { ZodError, ZodIssue } from 'zod';
import { IGenaricErrorMessage } from '../interfaces/error';

const handleZodError = (error: ZodError) => {
  const errors: IGenaricErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  const statuCode = 400;

  return {
    statuCode,
    message: 'Validation Error',
    errorMessage: errors,
  };
};

export default handleZodError;
