import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      rSuccess(data: any): void;
      rError(message: string, status?: number): void;
    }
  }
}

const resp = (request: Request, response: Response, next: NextFunction) => {
  const r: any = { success: (response.statusCode / 200 | 0) === 1 };

  response.rError = (message: string, status: number | undefined = 500) => {
    r.message = message;

    response.status(status).json(r);
  }

  response.rSuccess = (data: any) => {
    r.data = data;

    response.json(r);
  }

  next();
};

export default resp;