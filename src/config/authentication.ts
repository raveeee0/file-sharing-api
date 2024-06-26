
import passport from "passport"
import passportjwt from "passport-jwt";
import dotenv from "dotenv";
import userModel from "../models/user";
dotenv.config();

const jwtStrategy = passportjwt.Strategy;
const extractJwt = passportjwt.ExtractJwt;

const StrategyOptions = {
    secretOrKey: process.env.JWT_SECRET?.toString() || '',
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new jwtStrategy(
    StrategyOptions,
    (payload, done) => {
        userModel.findById(payload.id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch((error) => {
                return done(error, null);
            });
    }
);

export default () => {
    passport.use(strategy);
}