import { Publisher } from '@zuaticket/common';
import { Subjects } from '@zuaticket/common';
export class OrderCancelledPublisher extends Publisher {
    subject = Subjects.OrderCancelled;
}
