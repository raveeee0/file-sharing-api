import { validationResult } from 'express-validator';
import express from 'express';
import bcrypt from 'bcrypt';

import userModel from '../models/user';
import NoUserFoundException from '../exceptions/NoUserFoundException';
import ValidationError from '../exceptions/ValidationError';
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException';

import { publicVisibleProperties, userVisibleProperties, adminVisibleProperties } from '../types/userInterface';
import { isAdmin, isAuthenticated } from '../middlewares/authorization';

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
                res.status(200).json(filterUser(req.user, user));
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

function filterUser(req: any, user: any) {
    if(req.user && req.user.role && req.user.role == 'admin')
        return filterProperties(user, adminVisibleProperties);
    else if(req.user)
        return filterProperties(user, userVisibleProperties);
    else
        return filterProperties(user, publicVisibleProperties);
}

function filterProperties(user: any, properties: string[]) {
    const filteredUser: any = {};
    properties.forEach((property) => {
        filteredUser[property] = user[property];
    });
    return filteredUser;
}
