import express from "express";
import morgan from "morgan";

import connectDatabase from "./config/database";
import configAuthentication from "./config/authentication";

import userRouter from "./routes/user";
import loginRouter from "./routes/login";

import { debug } from "console";
import { rateLimit } from "express-rate-limit"

import RateLimitError from "./exceptions/RateLimitException";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    legacyHeaders: false,
    standardHeaders: "draft-7",
    statusCode: 429,
});

const app: express.Application = express();
connectDatabase();
configAuthentication();

app.use(morgan("dev"));

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/users", userRouter)
app.use("/login", loginRouter)

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        debug('HTTP server closed')
    })
})
  