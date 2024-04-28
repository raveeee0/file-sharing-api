import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectTestDB = async () => {
    const mongoDB = `mongodb://${process.env.TEST_MONGODB_USER}:${process.env.TEST_MONGODB_PASSWORD}/${process.env.TEST_MONGODB_DATABASE}`;

    mongoose.connect(mongoDB,
        {
            authSource: "admin",
            user: process.env.TEST_MONGODB_USER,
            pass: process.env.TEST_MONGODB_PASSWORD,
        }
    )
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => console.log("Error connecting to MongoDB", error));

}

export default connectTestDB;