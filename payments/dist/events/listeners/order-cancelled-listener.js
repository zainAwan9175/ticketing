import { Listener, Subjects } from '@zuaticket/common';
import { OrderStatus } from '@zuaticket/common';
import { Order } from '../../models/order.js';
import { queueGroupName } from './queue-group-name.js';
export class OrderCancelledListener extends Listener {
    subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { id, version } = data;
        const order = await Order.findOne({
            _id: id,
            version: version - 1,
        });
        if (!order) {
            throw new Error('Order not found');
        }
        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }
}
