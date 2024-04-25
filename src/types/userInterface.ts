import mongoose from "mongoose";

interface User {
    _id: mongoose.Types.ObjectId;
    name: String;
    email: String;
    nickname: String;
    roles: String[];
    password: String;
    files: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
}

export default User;