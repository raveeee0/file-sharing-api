import mongoose from "mongoose";

interface File {
    title: String;
    description: String;
    creator: mongoose.Types.ObjectId;
    createdAt: Date;
    comments: mongoose.Types.ObjectId[];
    url: string; // for cloud upload
    likes: Number;
}

const fileSchema = new mongoose.Schema<File>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    url: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

const fileModel = mongoose.model<File>('File', fileSchema);

export default fileModel;