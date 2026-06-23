import { Subjects, Listener } from '@zuaticket/common';
import { Ticket } from '../../models/ticket.js';
import { queueGroupName } from './queue-group-name.js';
export class TicketUpdatedListener extends Listener {
    subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { id, title, price } = data;
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({
            title,
            price,
        });
        await ticket.save();
        msg.ack();
    }
}
