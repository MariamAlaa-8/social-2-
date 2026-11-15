import mongoose from "mongoose";
import { IPost } from "../../common/interface/post.interface";

const postSchema = new mongoose.Schema<IPost>({
    content: {
        type: String,
        minLength: 1,
        maxLength: 1000,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
});

postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post"
});

export const PostModel = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);