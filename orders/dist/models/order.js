import mongoose from 'mongoose';
import { OrderStatus } from '@zuaticket/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs) => {
    return new Order(attrs);
};
const Order = mongoose.model('Order', orderSchema);
export { Order, OrderStatus };
