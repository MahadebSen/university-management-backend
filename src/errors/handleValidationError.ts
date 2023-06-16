import mongoose from 'mongoose';
import { IGenaricErrorResponse } from '../interfaces/common';
import { IGenaricErrorMessage } from '../interfaces/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenaricErrorResponse => {
  // Object.values() ---> [].map() ---> {path: "the path", message: "the error message"}
  const errors: IGenaricErrorMessage[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: errors,
  };
};

export default handleValidationError;
