import { Response } from 'express';

interface TResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
