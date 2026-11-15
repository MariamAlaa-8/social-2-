"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const index_1 = require("../../common/repository/index");
const index_2 = require("../../common/exception/index");
const mongoose_1 = __importDefault(require("mongoose"));
class PostService {
    postRepository = index_1.postRepository;
    async createPost(userId, data) {
        return await this.postRepository.createOne({
            data: { ...data, user: userId }
        });
    }
    async getAllMyPosts(userId) {
        return await this.postRepository.find({
            filter: { user: new mongoose_1.default.Types.ObjectId(userId) },
            options: { sort: { createdAt: -1 } }
        });
    }
    async getSinglePost(postId) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { populate: [{ path: "user", select: "firstname lastname image" }] }
        });
        if (!post)
            throw new index_2.NotfoundException("Post not found");
        return post;
    }
    async updatePost(userId, postId, data) {
        const post = await this.postRepository.findById({ id: new mongoose_1.default.Types.ObjectId(postId) });
        if (!post)
            throw new index_2.NotfoundException("Post not found");
        if (post.user.toString() !== userId) {
            throw new index_2.ForbiddenException("You are not the owner of this post");
        }
        return await this.postRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(postId),
            update: { $set: data },
            options: { new: true }
        });
    }
    async deletePost(userId, postId) {
        const post = await this.postRepository.findById({ id: new mongoose_1.default.Types.ObjectId(postId) });
        if (!post)
            throw new index_2.NotfoundException("Post not found");
        if (post.user.toString() !== userId) {
            throw new index_2.ForbiddenException("You are not the owner of this post");
        }
        await this.postRepository.findByIdAndDelete({ id: new mongoose_1.default.Types.ObjectId(postId) });
        return { message: "Post deleted successfully" };
    }
}
exports.PostService = PostService;
