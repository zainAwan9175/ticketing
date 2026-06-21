import {Listener, OrderCreatedEvent, Subjects} from "@zuaticket/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name.js";
import {Order} from "../../models/order.js";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const {id, ticket, status, userId, version} = data;
        const order = Order.build({
            id,
            price: ticket.price,
            status,
            userId,
            version,  
                  
        });
        await order.save();
        msg.ack();
    }
}
