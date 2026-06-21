import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from '@zuaticket/common';
import {Ticket} from '../../models/ticket.js';
import {queueGroupName} from './queue-group-name.js'
import {ExpirationCompleteEvent} from '@zuaticket/common';
import {Order} from '../../models/order.js';
import {OrderStatus} from '@zuaticket/common';
import { OrderCancelledEvent } from '@zuaticket/common';
import {OrderCancelledPublisher} from '../publishers/order-cancelled-publisher.js';
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const {orderId} = data;
        const ticket = await Ticket.findOne({'orders.id': orderId});
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const order =await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status:OrderStatus.Cancelled,
        })
        await order.save();
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: ticket.id,
            }
        })
        msg.ack();
    }}


