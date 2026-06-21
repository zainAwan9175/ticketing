import express from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError, currentUser } from '@zuaticket/common';
import { Order } from '../models/order.js';
const router = express.Router();
router.get('/api/orders/:orderId', currentUser, requireAuth, async (req, res) => {
    const request = req;
    const order = await Order.findById(request.params.orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== request.currentUser.id) {
        throw new NotAuthorizedError();
    }
    res.send(order);
});
export { router as showOrderRouter };
