import { Publisher } from '@zuaticket/common';
import { Subjects } from '@zuaticket/common';
export class OrderCreatedPublisher extends Publisher {
    subject = Subjects.OrderCreated;
}
