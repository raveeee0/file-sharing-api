import express from "express";
import { body, validationResult } from "express-validator";

import * as userService from "../services/user";

const router: express.Router = express.Router();

router.get("/", userService.getUsers);

router.post("/", [
    body("name").isString().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("nickname").isString()
], userService.createUser);


export default router;