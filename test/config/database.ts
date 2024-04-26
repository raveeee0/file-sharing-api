import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectTestDB = async () => {
    let mongoDbUrl: string = "";
    if (process.env.TEST_MONGODB_USER && process.env.TEST_MONGODB_PASSWORD)
        mongoDbUrl = `mongodb://${process.env.TEST_MONGODB_USER}:${process.env.TEST_MONGODB_PASSWORD}@127.0.0.1:27017/${process.env.TEST_MONGODB_DATABASE}`;
    else
        mongoDbUrl = `mongodb://127.0.0.1:27017/${process.env.TEST_MONGODB_DATABASE}`;


    if (mongoDbUrl === "") {
        console.log("MongoDB URL is not set");
        process.exit(1);
    }

    console.log(mongoDbUrl);


    mongoose.connect(mongoDbUrl,
        {
            authSource: "admin",
            user: process.env.TEST_MONGODB_USER,
            pass: process.env.TEST_MONGODB_PASSWORD,
        }
    )
        .then(() => console.log("Connected to MongoDB test database"))
        .catch((error) => console.log("Error connecting to MongoDB", error));

}

export default connectTestDB;