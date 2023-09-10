import { Router, Request, Response } from 'express';

export default class APIRouter {
  public router = Router({
    caseSensitive: true,
    strict: true
  });

  private initializeRoutes(): void {
    this.router.use('/', (req: Request, resp: Response) => {
      resp.send('pekaboo');
    });
  }

  constructor() {
    this.initializeRoutes();
  }
}