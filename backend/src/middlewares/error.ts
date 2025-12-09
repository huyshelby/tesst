import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const payload: any = { status, message: err.message || 'Internal Server Error' };
  if (err.code === 'P2002') payload.message = 'Unique constraint failed';
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(status).json(payload);
}
