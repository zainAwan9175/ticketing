import { Publisher, Subjects } from '@zuaticket/common';
export class TicketCreatedPublisher extends Publisher {
    subject = Subjects.TicketCreated;
}
