import { Listener, Subjects } from '@zuaticket/common';
import { Ticket } from '../../models/ticket.js';
import { queueGroupName } from './queue-group-name.js';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.js';
export class OrderCancelledListener extends Listener {
    subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
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
