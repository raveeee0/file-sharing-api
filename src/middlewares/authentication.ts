import express from 'express';
import AuthenticationException from '../exceptions/AuthenticationException';
import passport from 'passport';
import {User} from '../types/userInterface';

function validateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (!req.user) {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) {
			next(new AuthenticationException('Token is missing'));
		} else {
			passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
				if (err)
					next(err);
				else if (!user)
					next(new AuthenticationException('Invalid token'));
				else {
					req.user = user;
					next();
				}
			})(req, res, next);
		}
	}
};

export default validateToken;