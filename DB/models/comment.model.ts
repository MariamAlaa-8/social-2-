import mongoose from "mongoose";
import { IComment } from "../../common/interface/comment.interface";

const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
});

export const CommentModel = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);