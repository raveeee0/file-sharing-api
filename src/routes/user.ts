import express from "express";
import { body } from "express-validator";

import * as userService from "../services/user";
import passport from "passport";
import isAdmin from "../middlewares/authorization";

const router: express.Router = express.Router();

router.get("/", userService.getUsers);

router.get("/:id", userService.getUser);

router.get("/:id/files", passport.authenticate("jwt", { session: false }), userService.getUserFiles);

export default router;