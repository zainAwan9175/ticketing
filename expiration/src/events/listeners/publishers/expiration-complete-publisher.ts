import { Subjects } from "@zuaticket/common";
import { Publisher } from "@zuaticket/common";
import { ExpirationCompleteEvent } from "@zuaticket/common";
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}