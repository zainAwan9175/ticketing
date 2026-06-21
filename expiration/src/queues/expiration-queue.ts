import Queue from 'bull';
import { ExpirationCompleteEvent } from '@zuaticket/common';
import { ExpirationCompletePublisher } from '.././events/listeners/publishers/expiration-complete-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

process.on('SIGINT', () => expirationQueue.close());
process.on('SIGTERM', () => expirationQueue.close());

expirationQueue.process(async (job) => {

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});


export { expirationQueue };
