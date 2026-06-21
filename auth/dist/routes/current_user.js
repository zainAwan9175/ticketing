import express from 'express';
import { currentUser } from '@zuaticket/common';
const router = express.Router();
router.get('/api/users/currentuser', currentUser, (req, res) => {
    const request = req;
    res.send({ currentUser: request.currentUser ?? null });
});
export { router as currentUserRouter };
