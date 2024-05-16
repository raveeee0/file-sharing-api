import express from 'express';
import AuthenticationException from '../exceptions/AuthenticationException';

const isAdmin = (req: any, res: express.Response, next: express.NextFunction) => {
	if (req.user && req.user.role && !(req.user.role == 'admin')) {
		return res.status(401).json({ message: 'Unauthorized, user is not admin' });
	}
	next();
}

const isAuthenticated = (req: any, res: express.Response, next: express.NextFunction) => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized, user is not authenticated' });
	}
	next();
}

export { isAdmin, isAuthenticated };