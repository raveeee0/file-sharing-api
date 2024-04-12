import mongoose from "mongoose";

interface Comment {
    content: String;
    creator: mongoose.Types.ObjectId;
    timestamp: Date;
    likes: Number;
}

const commentSchema = new mongoose.Schema<Comment>({
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    likes: { type: Number, default: 0 }
});

const commentModel = mongoose.model<Comment>('Comment', commentSchema);

export default commentModel;