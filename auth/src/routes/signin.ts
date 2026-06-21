import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@zuaticket/common';
import { User } from '../models/user.js';
import { Password } from '../services/password.js';
import { BadRequestError, RequestValidationError, type SessionData } from '@zuaticket/common';

interface RequestWithSession extends Request {
  session?: SessionData | null;
}

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required'),
  ],validateRequest,
  async (req: Request, res: Response) => {
    const request = req as RequestWithSession;
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }
    //we use middle ware so i commented above code and added validateRequest as middle 

    const { email, password } = req.body;

    // Find user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    // Compare passwords
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT in session
    request.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };