import 'dotenv/config';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper.js';
import { app } from './app.js';
import { OrderCreatedListener } from './events/listeners/order-created-listener.js';
import {OrderCancelledListener} from './events/listeners/order-cancelled-listener.js';

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    const mongoUri = process.env.MONGO_URI||'okoko' ;
    const port = Number(process.env.PAYMENT_PORT ?? 3000);

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`orders service is running on port ${port}`);
    });
  } catch (err) {
    console.error('Fatal error starting orders service', err);
    process.exit(1);
  }
};

void start();
