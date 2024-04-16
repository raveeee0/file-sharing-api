import mongoose from "mongoose";

interface Comment {
    content: String;
    creator: mongoose.Types.ObjectId;
    file: mongoose.Types.ObjectId;
    createdAt: Date;
    likes: Number;
}

const commentSchema = new mongoose.Schema<Comment>({
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    likes: { type: Number, default: 0 }
});

const commentModel = mongoose.model<Comment>('Comment', commentSchema);

export default commentModel;