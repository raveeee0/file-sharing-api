import express from "express";
import {User} from "../types/userInterface";

import NoUserFoundException from "../exceptions/NoUserFoundException";
import fileModel from "../models/file";
import NoFileFoundException from "../exceptions/NoFileFoundException";
import AuthorizationException from "../exceptions/AuthorizationException";

const getFiles = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fileModel.find()
        .then((files) => {
            res.status(200).json(files);
        })
        .catch((error) => {
            next(error);
        });
}

const getFile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    fileModel.findById(id)
        .then((file) => {
            if (file) {
                res.status(200).json(file);
            } else {
                next(new NoFileFoundException(id));
            }
        })
        .catch((error) => {
            next(error);
        });
}

const deleteFile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    fileModel.findByIdAndDelete(id)
        .then((file) => {
            if (file) {
                const user: User = req.user as User;
                if (file.creator !== user._id)
                    next(new AuthorizationException('You are not allowed to delete this file'));
                else
                    res.status(200).json(file);
            } else {
                next(new NoFileFoundException(id));
            }
        })
        .catch((error) => {
            next(error);
        });
}

const createFile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { title, description } = req.body;

    if (!req.user) {
        next(new Error('User is not authenticated'));
    } else {
        const user: User = req.user as User;
        const file = new fileModel({ title, description, creator: user._id, createdAt: new Date(), comments: [], url: '', likes: 0 });
        file.save()
            .then((file) => {
                res.status(201).json(file);
            })
            .catch((error) => {
                next(error);
            });
    }
}

const getFileComments = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    fileModel.findById(id)
        .then((file) => {
            if (file) {
                res.status(200).json(file.comments);
            } else {
                next(new NoFileFoundException(id));
            }
        })
        .catch((error) => {
            next(error);
        });
}


export { getFile, getFiles, deleteFile, getFileComments, createFile }