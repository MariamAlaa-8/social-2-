"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
});
exports.CommentModel = mongoose_1.default.models.Comment || mongoose_1.default.model('Comment', commentSchema);
