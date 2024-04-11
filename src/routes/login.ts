import express from 'express';
import bcrypt from 'bcrypt';

import loginService from '../services/login';
import userModel from '../models/user';
import { body } from 'express-validator';


const loginRouter: express.Router = express.Router();

loginRouter.post('/', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password required')
], loginService.loginUser);

export default loginRouter;