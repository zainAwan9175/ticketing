import express from 'express';
import { currentUser, requireAuth } from '@zuaticket/common';
const router = express.Router();
router.post('/api/users/signout', currentUser, requireAuth, (req, res) => {
    const request = req;
    request.session = null;
    res.send({});
});
export { router as signoutRouter };
