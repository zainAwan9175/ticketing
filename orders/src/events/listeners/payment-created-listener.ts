import { Subjects } from "@zuaticket/common";
import {Listener} from "@zuaticket/common";
import {PaymentCreatedEvent} from "@zuaticket/common";
import {Message} from "node-nats-streaming";
import {OrderStatus} from "@zuaticket/common";
import {Order} from "../../models/order.js";
import {queueGroupName} from "./queue-group-name.js";
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const {orderId} = data;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.set({status: OrderStatus.Complete});
        await order.save();
        msg.ack();
    }
}
