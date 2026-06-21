import express from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '@zuaticket/common';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
], async (req, res) => {
    const request = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ errors: [{ message: 'Email in use' }] });
    }
    const user = User.build({ email, password });
    await user.save();
    const userJwt = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_KEY);
    request.session = {
        jwt: userJwt
    };
    res.status(201).send(user);
});
export { router as signupRouter };
