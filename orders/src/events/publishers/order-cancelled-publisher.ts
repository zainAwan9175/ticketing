import {Publisher} from '@zuaticket/common';
import {Subjects} from '@zuaticket/common';
import {OrderCancelledEvent} from '@zuaticket/common';
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
