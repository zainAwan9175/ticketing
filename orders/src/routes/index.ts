import express, { Request, Response } from 'express';
import { requireAuth, currentUser } from '@zuaticket/common';
import { Order } from '../models/order.js';
import { RequestWithCurrentUser } from './types.js';

const router = express.Router();

router.get(
  '/api/orders',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const request = req as RequestWithCurrentUser;
    const orders = await Order.find({
      userId: request.currentUser!.id,
    }).populate('ticket');

    res.send(orders);
  }
);

export { router as indexOrderRouter };
