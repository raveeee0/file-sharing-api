import { validationResult } from 'express-validator';
import express from 'express';

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

    const { name, email, nickname } = req.body;

    const user = new userModel({ name, email, nickname });

    user.save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error creating user", error });
        });
}

export { getUsers, createUser };