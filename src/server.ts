import express from "express";
import morgan from "morgan";

import connectDatabase from "./config/database";

import userRouter from "./routes/user";
import { debug } from "console";

const app: express.Application = express();
connectDatabase();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/users", userRouter);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        debug('HTTP server closed')
    })
})
  