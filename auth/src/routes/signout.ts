import express from 'express';
import type { Request, Response } from 'express';
import { currentUser, requireAuth, type SessionData } from '@zuaticket/common';

const router = express.Router();

router.post('/api/users/signout', currentUser, requireAuth, (req: Request, res: Response) => {
	const request = req as Request & {
		session?: SessionData | null;
	};

	request.session = null;

	res.send({});
});

export { router as signoutRouter };