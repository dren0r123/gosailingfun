import { NextFunction, Request, Response } from 'express';

import { getErrorMessage } from '../services';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const message = getErrorMessage(err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 400;

  res.locals.errorMessage = message;
  res.status(statusCode !== 500 ? statusCode : 400).json({
    error: message,
    timestamp: new Date().toISOString(),
  });
};
