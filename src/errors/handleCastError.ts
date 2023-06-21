import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IGenaricErrorMessage } from '../interfaces/error';
import { IGenaricErrorResponse } from '../interfaces/common';

const handleCastError = (
  error: mongoose.Error.CastError
): IGenaricErrorResponse => {
  const errors: IGenaricErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid _id',
    },
  ];

  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
