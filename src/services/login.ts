import express from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

import userModel from '../models/user';
import ValidationError from '../exceptions/ValidationError';
import AuthenticationException from '../exceptions/AuthenticationException';

const loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return new ValidationError('Validation for user login failed', errors.array());
    }

    const { email, password } = req.body;

    userModel.findOne({ email })
        .then((user) => {
            if(user) {
                bcrypt.compare(password, user.password as string)
                    .then((isMatch) => {
                        if(!isMatch) {
                            next(new AuthenticationException("Invalid credentials"));
                        }

                        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
                        res.status(200).json({ token });
                    });
            }
            else {
                next(new AuthenticationException("User not found"));
            }
        })
        .catch((error) => {
            next(error);
        });

    
}

export default {loginUser};