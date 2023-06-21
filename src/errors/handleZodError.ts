import { ZodError, ZodIssue } from 'zod';
import { IGenaricErrorMessage } from '../interfaces/error';
import { IGenaricErrorResponse } from '../interfaces/common';

const handleZodError = (error: ZodError): IGenaricErrorResponse => {
  const errors: IGenaricErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
