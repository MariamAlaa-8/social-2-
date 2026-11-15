"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const index_1 = require("../../common/repository/index");
const index_2 = require("../../common/exception/index");
const mongoose_1 = __importDefault(require("mongoose"));
class CommentService {
    commentRepository = index_1.commentRepository;
    postRepository = index_1.postRepository;
    async createComment(userId, postId, content) {
        const post = await this.postRepository.findById({ id: new mongoose_1.default.Types.ObjectId(postId) });
        if (!post)
            throw new index_2.NotfoundException("Post not found");
        const comment = await this.commentRepository.createOne({
            data: { content, user: userId, post: postId }
        });
        await this.postRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(postId),
            update: { $inc: { commentsCount: 1 } }
        });
        return comment;
    }
    async getPostComments(postId) {
        return await this.commentRepository.find({
            filter: { post: new mongoose_1.default.Types.ObjectId(postId) },
            options: {
                sort: { createdAt: -1 },
                populate: [{ path: "user", select: "firstname lastname image" }]
            }
        });
    }
    async getSingleComment(commentId) {
        const comment = await this.commentRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(commentId),
            options: { populate: [{ path: "user", select: "firstname lastname image" }] }
        });
        if (!comment)
            throw new index_2.NotfoundException("Comment not found");
        return comment;
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.commentRepository.findById({ id: new mongoose_1.default.Types.ObjectId(commentId) });
        if (!comment)
            throw new index_2.NotfoundException("Comment not found");
        if (comment.user.toString() !== userId) {
            throw new index_2.ForbiddenException("You are not the owner of this comment");
        }
        return await this.commentRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(commentId),
            update: { $set: { content } },
            options: { new: true }
        });
    }
    async deleteComment(userId, commentId) {
        const comment = await this.commentRepository.findById({ id: new mongoose_1.default.Types.ObjectId(commentId) });
        if (!comment)
            throw new index_2.NotfoundException("Comment not found");
        const post = await this.postRepository.findById({ id: comment.post });
        const isCommentOwner = comment.user.toString() === userId;
        const isPostOwner = post && post.user.toString() === userId;
        if (!isCommentOwner && !isPostOwner) {
            throw new index_2.ForbiddenException("You don't have permission to delete this comment");
        }
        await this.commentRepository.findByIdAndDelete({ id: new mongoose_1.default.Types.ObjectId(commentId) });
        if (post) {
            await this.postRepository.findByIdAndUpdate({
                id: post._id,
                update: { $inc: { commentsCount: -1 } }
            });
        }
        return { message: "Comment deleted successfully" };
    }
}
exports.CommentService = CommentService;
