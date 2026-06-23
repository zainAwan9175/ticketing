import { Subjects, Publisher } from '@zuaticket/common';
export class PaymentcreatedPublisher extends Publisher {
    subject = Subjects.PaymentCreated;
}
