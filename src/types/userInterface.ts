import mongoose from "mongoose";

interface User {
    _id: mongoose.Types.ObjectId;
    name: String;
    email: String;
    username: String;
    role: String;
    password: String;
    files: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
}

export default User;