import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError, currentUser } from '@zuaticket/common';
import { Order } from '../models/order.js';
import { RequestWithCurrentUser } from './types.js';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const request = req as RequestWithCurrentUser;
    const order = await Order.findById(request.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
