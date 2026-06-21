import jwt from 'jsonwebtoken';
export const currentUser = (req, res, next) => {
    const token = req.session?.jwt;
    if (!token) {
        return next();
    }
    try {
        const jwtKey = process.env.JWT_KEY;
        if (!jwtKey) {
            return next();
        }
        const payload = jwt.verify(token, jwtKey);
        req.currentUser = payload;
    }
    catch (err) { }
    next();
};
