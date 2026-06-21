import {Publisher, Subjects, TicketUpdatedEvent} from '@zuaticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
