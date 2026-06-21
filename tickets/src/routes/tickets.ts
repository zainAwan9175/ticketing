import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import {TicketCreatedPublisher} from '../events/publishers/ticket-created-publisher.js';
import {TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';
import {BadRequestError} from '@zuaticket/common';
import {
  currentUser,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  type UserPayload,
} from '@zuaticket/common';

import mongoose from 'mongoose';
import { Ticket } from '../models/ticket.js';

const router = express.Router();

interface RequestWithCurrentUser extends Request {
  currentUser?: UserPayload;
}

router.get('/api/tickets', async (_req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

router.post(
  '/api/tickets',
  currentUser,
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const request = req as RequestWithCurrentUser;
    const { title, price } = req.body as { title: string; price: number | string };

    const ticket = Ticket.build({
      title,
      price: Number(price),
      userId: request.currentUser!.id,
    });

    await ticket.save();
     new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const request = req as RequestWithCurrentUser;
    const id = typeof req.params.id === 'string' ? req.params.id : '';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body as { title: string; price: number | string };

    ticket.set({
      title,
      price: Number(price),
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });


    res.send(ticket);
  }
);

export { router as ticketsRouter };