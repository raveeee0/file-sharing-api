import { validationResult } from 'express-validator';
import express from 'express';
import bcrypt from 'bcrypt';

import userModel from '../models/user';
import NoUserFoundException from '../exceptions/NoUserFoundException';
import ValidationError from '../exceptions/ValidationError';
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException';

const getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    userModel.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            next(error);
        });
}

const getUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    userModel.findById(id)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                next(new NoUserFoundException(id));
            }
        })
        .catch((error) => {
            next(error)
        })
}

const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ValidationError('Validation for user creation failed', errors.array());
        next(error);
    }

    const { name, email, username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        userModel.findOne({ $or: [{ email }, { username }] })
            .then((existingUser) => {
                if (existingUser) {
                    if (existingUser.email === email) {
                        next(new UserAlreadyExistsException('Email already exists'));
                    } else {
                        next(new UserAlreadyExistsException('Username already exists'));
                    }
                } else {
                    const user = new userModel({ email, name, username, password: hash, role: 'user' });
                    user.save()
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((error) => {
                            next(error);
                        });
                }
            })
            .catch((error) => {
                next(error);
            });
    });
}

const getUserFiles = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;

    userModel.findById(id)
        .then((user) => {
            if (user) {
                res.status(200).json(user.files);
            } else {
                next(new NoUserFoundException(id));
            }
        })
        .catch((error) => {
            next(error);
        });
}

export { getUsers, getUser, createUser, getUserFiles };