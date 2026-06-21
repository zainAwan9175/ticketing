import {Publisher} from '@zuaticket/common';
import {Subjects} from '@zuaticket/common';
import {OrderCreatedEvent} from '@zuaticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
