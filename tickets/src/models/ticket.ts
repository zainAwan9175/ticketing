import mongoose from 'mongoose';
import  {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string | undefined;
  version?: number | undefined;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  id: string;
  version: number;
  orderId?: string | undefined;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
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

  },
  {
    toJSON: {
      transform(_doc: mongoose.Document, ret: { _id?: mongoose.Types.ObjectId; __v?: number; id?: string }) {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret._id;

        return ret;
      },
    },
  }
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket };