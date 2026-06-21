import mongoose from 'mongoose';
import { Order } from './order.js';
import { OrderStatus } from '@zuaticket/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    toJSON: {
        transform(_doc, ret) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};
ticketSchema.statics.findByEvent = (event) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });
    return !!existingOrder;
};
const Ticket = mongoose.model('Ticket', ticketSchema);
export { Ticket };
