import {Publisher, Subjects, TicketCreatedEvent} from '@zuaticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

