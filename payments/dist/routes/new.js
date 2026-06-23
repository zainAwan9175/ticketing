import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, BadRequestError, currentUser } from '@zuaticket/common';
import mongoose from 'mongoose';
import { PaymentcreatedPublisher } from '../events/publishers/payment-created-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';
import { Order } from "../models/order.js";
import { Payment } from '../models/payment.js';
import { OrderStatus } from '@zuaticket/common';
import { stripe } from '../stripe.js';
const router = express.Router();
router.post('/api/orders', currentUser, requireAuth, [
    body('token')
        .not().isEmpty()
        .withMessage('Token must be provided'),
    body('orderId')
        .not().isEmpty()
        .custom((input) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('OrderId must be provided'),
], validateRequest, async (req, res) => {
    const request = req;
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== request.currentUser.id) {
        throw new BadRequestError('Not authorized to pay for this order');
    }
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for a cancelled order');
    }
    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: 'usd',
        source: token,
    });
    const payment = Payment.build({
        orderId,
        stripeId: charge.id,
    });
    await payment.save();
    await new PaymentcreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
    });
    res.status(204).send(order);
});
export { router as createChargeRouter };
