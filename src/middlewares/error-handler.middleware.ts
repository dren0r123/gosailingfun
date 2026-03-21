import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors';
import { getErrorMessage } from '../services';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const message = getErrorMessage(err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  }

  res.locals.errorMessage = message;
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
  });
};
