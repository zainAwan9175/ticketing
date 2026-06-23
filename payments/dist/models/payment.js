import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
paymentSchema.statics.build = (attrs) => {
    return new Payment({
        orderId: attrs.orderId,
        stripeId: attrs.stripeId,
    });
};
const Payment = mongoose.model('Payment', paymentSchema);
export { Payment };
