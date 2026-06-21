import express from 'express';
import { errorHandler, NotFoundError } from '@zuaticket/common';
import cookieSession from 'cookie-session';

import { newOrderRouter } from './routes/new.js';
import { showOrderRouter } from './routes/show.js';
import { indexOrderRouter } from './routes/index.js';
import { deleteOrderRouter } from './routes/delete.js';

const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get('/', (req, res) => {
  res.send('A');
});

app.all('/{*notFound}', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
