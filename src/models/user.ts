import mongoose from 'mongoose';

interface User {
    name: String;
    email: String;
    nickname: String;
    roles: String[];
    password: String;
}

const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true},
    nickname: String,
    roles: [{ 
        type: String, 
        enum: ['admin', 'user'],
        default: ['user']
      }],
      password: { type: String, required: true, format: 'password' }
});


const userModel = mongoose.model<User>('User', userSchema);

export default userModel;