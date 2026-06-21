import { Publisher, Subjects } from '@zuaticket/common';
export class TicketUpdatedPublisher extends Publisher {
    subject = Subjects.TicketUpdated;
}
