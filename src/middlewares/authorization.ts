import express from 'express';
import AuthenticationException from '../exceptions/AuthenticationException';

const isAdmin = (req: any, res: express.Response, next: express.NextFunction) => {
	if (req.user && req.user.roles && !req.user.roles.includes('admin')) {
		return res.status(401).json({ message: 'Unauthorized, user is not admin' });
	}
	next();
}

export default isAdmin;