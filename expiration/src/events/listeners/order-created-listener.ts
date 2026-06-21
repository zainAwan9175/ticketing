import { Message } from "node-nats-streaming";
import { Listener } from "@zuaticket/common";
import { OrderCreatedEvent } from "@zuaticket/common";
import { queueGroupName } from "./queue-group-name.js";
import { Subjects } from "@zuaticket/common";
import {expirationQueue} from "../../queues/expiration-queue.js";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // console.log("Event data!", data);
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Waiting this many milliseconds to process the job:", delay);
        await expirationQueue.add(
            { orderId: data.id },
             { delay });
        msg.ack();
    }
}

