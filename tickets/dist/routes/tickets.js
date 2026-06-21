import express from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher.js';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';
import { BadRequestError } from '@zuaticket/common';
import { currentUser, requireAuth, validateRequest, NotAuthorizedError, NotFoundError, } from '@zuaticket/common';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket.js';
const router = express.Router();
router.get('/api/tickets', async (_req, res) => {
    const tickets = await Ticket.find({});
    res.send(tickets);
});
router.get('/api/tickets/:id', async (req, res) => {
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
router.post('/api/tickets', currentUser, requireAuth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
], validateRequest, async (req, res) => {
    const request = req;
    const { title, price } = req.body;
    const ticket = Ticket.build({
        title,
        price: Number(price),
        userId: request.currentUser.id,
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
});
router.put('/api/tickets/:id', currentUser, requireAuth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
], validateRequest, async (req, res) => {
    const request = req;
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
    if (ticket.userId !== request.currentUser.id) {
        throw new NotAuthorizedError();
    }
    const { title, price } = req.body;
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
});
export { router as ticketsRouter };
