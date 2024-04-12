import mongoose from "mongoose";

interface Post {
    title: String;
    content: String;
    creator: mongoose.Types.ObjectId;
    timestamp: Date;
    comments: mongoose.Types.ObjectId[];
    imageUrl: string; // for cloud upload
    likes: Number;
}

const postSchema = new mongoose.Schema<Post>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: { type: Date, required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment'}],
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

const postModel = mongoose.model<Post>('Post', postSchema);

export default postModel;