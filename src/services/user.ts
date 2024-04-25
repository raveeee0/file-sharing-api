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

    const { name, email, nickname, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        userModel.findOne({ roles: { $in: ['admin'] } })
            .then((admin) => {
                // If no admin are present the first registered user will be an admin
                let roles;
                if (!admin) {
                    roles = ['admin'];
                } else {
                    roles = ['user'];
                }

                userModel.findOne({ email })
                    .then((user) => {
                        console.log(user);
                        if (user) {
                            next(new UserAlreadyExistsException(email));
                        } else {
                            const user = new userModel({ email, name, nickname, password: hash, roles });
                            user.save()
                                .then((user) => {
                                    res.status(201).json(user);
                                })
                                .catch((error) => {
                                    next(error);
                                })
                        }
                    })
                    .catch((error) => {
                        next(error);
                    });
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