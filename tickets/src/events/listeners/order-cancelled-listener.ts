import { Listener, OrderCancelledEvent, Subjects } from '@zuaticket/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.js';
import { queueGroupName } from './queue-group-name.js';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.js';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const { ticket } = data;
        const foundTicket = await Ticket.findById(ticket.id);
        if (!foundTicket) {
            throw new Error('Ticket not found');
        }
        foundTicket.set({ orderId: undefined });
        await foundTicket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: foundTicket.id,
            title: foundTicket.title,
            price: foundTicket.price,
            userId: foundTicket.userId,
            version: foundTicket.version,
        });

        msg.ack();
    }
}