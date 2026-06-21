import {Subjects, Publisher, PaymentCreatedEvent} from '@zuaticket/common';

export class PaymentcreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}