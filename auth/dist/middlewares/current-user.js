import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../error/not-authorized-error.js';
export const currentUser = (req, res, next) => {
    const request = req;
    const token = request.session?.jwt;
    if (!token) {
        return next();
    }
    try {
        const jwtKey = process.env.JWT_KEY;
        if (!jwtKey) {
            return next();
        }
        const payload = jwt.verify(token, jwtKey);
        request.currentUser = payload;
    }
    catch (err) { }
    next();
};
export const requireAuth = (req, res, next) => {
    const request = req;
    if (!request.currentUser) {
        throw new NotAuthorizedError();
    }
    next();
};
