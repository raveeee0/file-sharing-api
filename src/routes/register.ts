import express from "express";
import { body } from "express-validator";

import * as userService from "../services/user";

const router: express.Router = express.Router();

router.post("/", [
    body("name").isString().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString()
], userService.createUser);

export default router;