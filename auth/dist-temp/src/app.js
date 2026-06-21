import express from 'express';
import { currentUserRouter } from './routes/current_user.js';
import { signinRouter } from './routes/signin.js';
import { signupRouter } from './routes/signup.js';
import { signoutRouter } from './routes/signout.js';
import { errorHandler } from './middlewares/error-handler.js';
import { NotFoundError } from './error/not-founderr.js';
import cookieSession from 'cookie-session';
const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.use(cookieSession({
    signed: false,
    secure: false
}));
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.get('/', (req, res) => {
    res.send('A');
});
app.all('/{*notFound}', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);
export { app };
