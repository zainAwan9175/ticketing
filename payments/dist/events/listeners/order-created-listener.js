import { Listener, Subjects } from "@zuaticket/common";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";
export class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { id, ticket, status, userId, version } = data;
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
