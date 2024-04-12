import express from 'express';

const isAdmin = (req: any, res: express.Response, next: express.NextFunction) => {
        if (req.user && req.user.roles && !req.user.roles.includes('admin')) {
                return res.status(401).json({ message: 'Unauthorized, user is not admin' });
        }
        next();
}

export { isAdmin }