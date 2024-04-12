import { validationResult } from 'express-validator';
import express from 'express';
import bcrypt from 'bcrypt';

import userModel from '../models/user';

const getUsers = async (req: express.Request, res: express.Response) => {
    userModel.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching users", error });
        });
}

const createUser = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { name, email, nickname, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log('hash')
            return res.status(500).json({ error: err });
        }

        userModel.findOne({ roles: { $in: ['admin'] } })
            .then((admin) => {
                if (!admin) {
                    const user = new userModel({ email, name, nickname, password: hash, roles: ['admin'] });
                    user.save()
                        .then((user: any) => {
                            console.log('saved')
                            res.status(201).json(user);
                        })
                        .catch((error: any) => {
                            console.log('err500')
                            res.status(500).json({ message: "Error creating user", error });
                        })
                }
            })
            .catch((error) => {
                res.status(500).json({ message: "Error creating user", error });
            });
    });
}

export { getUsers, createUser };