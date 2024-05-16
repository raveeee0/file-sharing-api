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

const userProperties = ['_id', 'name', 'email', 'username', 'role', 'password', 'files', 'friends'];

const adminVisibleProperties = ['_id', 'name', 'email', 'username', 'role', 'files', 'friends']; 
const userVisibleProperties = ['_id', 'name', 'email', 'username', 'files', 'friends']; 
const publicVisibleProperties = ['_id', 'name', 'username', 'files'];


export { User, userProperties, adminVisibleProperties, userVisibleProperties, publicVisibleProperties};