import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError, currentUser } from '@zuaticket/common';
import { Order, OrderStatus } from '../models/order.js';
import { RequestWithCurrentUser } from './types.js';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher.js';
const router = express.Router();

router.delete(
  '/api/orders/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const request = req as RequestWithCurrentUser;
    const { id } = request.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying this was cancelled
    await new OrderCancelledPublisher(request.app.get('natsWrapper').client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
