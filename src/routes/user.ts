import express from "express";
import { body, validationResult } from "express-validator";

import * as userService from "../services/user";
import passport from "passport";
import { isAdmin } from "../middlewares/authorization";

const router: express.Router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), isAdmin, userService.getUsers);

router.post("/", [
    body("name").isString().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("nickname").isString()
], userService.createUser);


export default router;