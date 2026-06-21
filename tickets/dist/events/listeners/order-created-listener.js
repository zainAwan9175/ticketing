import { Listener, Subjects } from '@zuaticket/common';
import { Ticket } from '../../models/ticket.js';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.js';
import { queueGroupName } from './queue-group-name.js';
export class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { id, ticket } = data;
        const foundTicket = await Ticket.findById(ticket.id);
        if (!foundTicket) {
            throw new Error('Ticket not found');
        }
        foundTicket.set({ orderId: id });
        await foundTicket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: foundTicket.id,
            title: foundTicket.title,
            price: foundTicket.price,
            userId: foundTicket.userId,
            version: foundTicket.version,
            orderId: id
        });
        msg.ack();
    }
}
