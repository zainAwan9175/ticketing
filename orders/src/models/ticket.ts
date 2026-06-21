import mongoose from 'mongoose';
import { Order } from './order.js';
import { OrderStatus } from '@zuaticket/common';
import  {updateIfCurrentPlugin} from 'mongoose-update-if-current';  

interface TicketAttrs {
  title: string;
  price: number;
  id?: string;
  version?: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  id: string;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
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
  },
  {
    toJSON: {
      transform(_doc: mongoose.Document, ret: { _id?: mongoose.Types.ObjectId; __v?: number; id?: string }) {
        if (ret._id) {
          ret.id = ret._id.toString();
        }

        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(
    {
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price,
    }
  );
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
