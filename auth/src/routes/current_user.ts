import express from 'express';
import type { Request, Response } from 'express';
import { currentUser, type UserPayload } from '@zuaticket/common';

const router = express.Router();

interface RequestWithCurrentUser extends Request {
  currentUser?: UserPayload;
}

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  const request = req as RequestWithCurrentUser;

  res.send({ currentUser: request.currentUser ?? null });
});

export { router as currentUserRouter };