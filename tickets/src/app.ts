import express from 'express';

import { errorHandler, NotFoundError } from '@zuaticket/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { ticketsRouter } from './routes/tickets.js';
const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.use(cookieSession({
  signed: false,
  secure: false
}));

app.use(ticketsRouter);



app.get('/', (req, res) => {
  res.send('A');
});

app.all('/{*notFound}', async(req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
