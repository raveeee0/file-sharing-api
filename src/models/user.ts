import mongoose from 'mongoose';

interface User {
    name: String;
    email: String;
    nickname: String;
}

const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true},
    nickname: String
});

const userModel = mongoose.model<User>('User', userSchema);

export default userModel;