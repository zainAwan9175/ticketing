import { Subjects, Listener } from '@zuaticket/common';
import { Ticket } from '../../models/ticket.js';
import { queueGroupName } from './queue-group-name.js';
export class TicketCreatedListener extends Listener {
    subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price,
        });
        await ticket.save();
        msg.ack();
    }
}
