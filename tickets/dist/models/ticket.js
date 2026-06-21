import mongoose from 'mongoose';
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
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
    },
}, {
    toJSON: {
        transform(_doc, ret) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret._id;
            return ret;
        },
    },
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs) => {
    return new Ticket(attrs);
};
const Ticket = mongoose.model('Ticket', ticketSchema);
export { Ticket };
