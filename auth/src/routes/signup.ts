import express from 'express'
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';
import { RequestValidationError, DatabaseConnectionError, type SessionData } from '@zuaticket/common';
import { User } from '../models/user.js';
import { Password } from '../services/password.js';
import jwt from 'jsonwebtoken';

interface RequestWithSession extends Request {
  session?: SessionData | null;
}
const router =express.Router()

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async(req: Request, res: Response) => {
    const request = req as RequestWithSession;
      const errors=validationResult(req)
    if(!errors.isEmpty()){
      throw new RequestValidationError(errors.array())
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
    }, process.env.JWT_KEY!);

    request.session = {
      jwt: userJwt
    };  
    
    
    res.status(201).send(user);
  }
);

export {router as signupRouter}
