import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map((val) => {
    return {
      path: val.path,
      message: val.message,
    };
  });

  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
