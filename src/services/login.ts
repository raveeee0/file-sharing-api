import express from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

import userModel from '../models/user';

const loginUser = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if(user) {
        const isMatch = await bcrypt.compare(password, user.password as string);

        if(!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
}

export default {loginUser};