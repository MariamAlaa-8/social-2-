"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        minLength: 1,
        maxLength: 1000,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.PostModel = mongoose_1.default.models.Post || mongoose_1.default.model('Post', postSchema);
