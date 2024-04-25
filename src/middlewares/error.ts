import express from 'express';
import HttpException from '../exceptions/HttpException';
import ValidationError from '../exceptions/ValidationError';

function errorMiddleware(error: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (error instanceof ValidationError) {
        return res.status(422).json({ message: error.message, data: error.data });
    }

    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    res.status(status).json({ message });
}

export default errorMiddleware;