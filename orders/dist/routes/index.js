import express from 'express';
import { requireAuth, currentUser } from '@zuaticket/common';
import { Order } from '../models/order.js';
const router = express.Router();
router.get('/api/orders', currentUser, requireAuth, async (req, res) => {
    const request = req;
    const orders = await Order.find({
        userId: request.currentUser.id,
    }).populate('ticket');
    res.send(orders);
});
export { router as indexOrderRouter };
