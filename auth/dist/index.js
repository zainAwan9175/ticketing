import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
const start = async () => {
    try {
        if (!process.env.JWT_KEY) {
            throw new Error('JWT_KEY must be defined');
        }
        const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/auth';
        const port = Number(process.env.AUTH_PORT ?? 3001);
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Auth service is running on port ${port}`);
        });
    }
    catch (err) {
        console.error('Fatal error starting auth service', err);
        process.exit(1);
    }
};
void start();
