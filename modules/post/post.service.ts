import { postRepository } from "../../common/repository/index";
import { NotfoundException, ForbiddenException } from "../../common/exception/index";
import mongoose from "mongoose";

export class PostService {
    private postRepository = postRepository;

 
    async createPost(userId: string, data: any) {
        return await this.postRepository.createOne({
            data: { ...data, user: userId }
        });
    }

    async getAllMyPosts(userId: string) {
        return await this.postRepository.find({
            filter: { user: new mongoose.Types.ObjectId(userId) },
            options: { sort: { createdAt: -1 } } 
        });
    }

    
    async getSinglePost(postId: string) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { populate: [{ path: "user", select: "firstname lastname image" }] }
        });
        if (!post) throw new NotfoundException("Post not found");
        return post;
    }

  
    async updatePost(userId: string, postId: string, data: any) {
        const post = await this.postRepository.findById({ id: new mongoose.Types.ObjectId(postId) });
        if (!post) throw new NotfoundException("Post not found");

       
        if (post.user.toString() !== userId) {
            throw new ForbiddenException("You are not the owner of this post");
        }

        return await this.postRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(postId),
            update: { $set: data },
            options: { new: true }
        });
    }

    async deletePost(userId: string, postId: string) {
        const post = await this.postRepository.findById({ id: new mongoose.Types.ObjectId(postId) });
        if (!post) throw new NotfoundException("Post not found");

        if (post.user.toString() !== userId) {
            throw new ForbiddenException("You are not the owner of this post");
        }

       

        await this.postRepository.findByIdAndDelete({ id: new mongoose.Types.ObjectId(postId) });
        return { message: "Post deleted successfully" };
    }
}