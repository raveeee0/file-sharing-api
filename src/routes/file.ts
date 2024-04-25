import express from "express";

import * as fileService from "../services/file";
import { body } from "express-validator";
import passport from "passport";

import validateToken from "../middlewares/authentication";

const router: express.Router = express.Router();

router.get("/", validateToken, fileService.getFiles);

router.get("/:id", fileService.getFile);

router.get("/:id/comments", fileService.getFileComments);

router.delete("/:id", passport.authenticate("jwt", { session: false }), fileService.deleteFile);

router.post("/", passport.authenticate("jwt", { session: false }), [
    body('title').isString(),
    body('description').isString()
], fileService.createFile);

export default router;
