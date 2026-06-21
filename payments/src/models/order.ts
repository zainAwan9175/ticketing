import mongoose from "mongoose";
import {OrderStatus} from "@zuaticket/common";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";
interface OrderAttrs {
    id: string;
    userId: string;
    price: number;
    status: OrderStatus;
    version: number;
    
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    price: number;
    status: string;
    version: number;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status,
        version: attrs.version,
    }
    );
}
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order };