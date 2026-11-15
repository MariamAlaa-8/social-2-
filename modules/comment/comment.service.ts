import { commentRepository, postRepository } from "../../common/repository/index";
import { NotfoundException, ForbiddenException } from "../../common/exception/index";
import mongoose from "mongoose";

export class CommentService {
    private commentRepository = commentRepository;
    private postRepository = postRepository;

    async createComment(userId: string, postId: string, content: string) {
        const post = await this.postRepository.findById({ id: new mongoose.Types.ObjectId(postId) });
        if (!post) throw new NotfoundException("Post not found");

        const comment = await this.commentRepository.createOne({
            data: { content, user: userId, post: postId }
        });

        await this.postRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(postId),
            update: { $inc: { commentsCount: 1 } }
        });

        return comment;
    }

    
    async getPostComments(postId: string) {
        return await this.commentRepository.find({
            filter: { post: new mongoose.Types.ObjectId(postId) },
            options: { 
                sort: { createdAt: -1 },
                populate: [{ path: "user", select: "firstname lastname image" }]
            }
        });
    }

    
    async getSingleComment(commentId: string) {
        const comment = await this.commentRepository.findById({
            id: new mongoose.Types.ObjectId(commentId),
            options: { populate: [{ path: "user", select: "firstname lastname image" }] }
        });
        if (!comment) throw new NotfoundException("Comment not found");
        return comment;
    }

   
    async updateComment(userId: string, commentId: string, content: string) {
        const comment = await this.commentRepository.findById({ id: new mongoose.Types.ObjectId(commentId) });
        if (!comment) throw new NotfoundException("Comment not found");

        if (comment.user.toString() !== userId) {
            throw new ForbiddenException("You are not the owner of this comment");
        }

        return await this.commentRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(commentId),
            update: { $set: { content } },
            options: { new: true }
        });
    }


    async deleteComment(userId: string, commentId: string) {
        const comment = await this.commentRepository.findById({ id: new mongoose.Types.ObjectId(commentId) });
        if (!comment) throw new NotfoundException("Comment not found");

        const post = await this.postRepository.findById({ id: comment.post });

        
        const isCommentOwner = comment.user.toString() === userId;
        const isPostOwner = post && post.user.toString() === userId;

        if (!isCommentOwner && !isPostOwner) {
            throw new ForbiddenException("You don't have permission to delete this comment");
        }

        await this.commentRepository.findByIdAndDelete({ id: new mongoose.Types.ObjectId(commentId) });

   
        if (post) {
            await this.postRepository.findByIdAndUpdate({
                id: post._id,
                update: { $inc: { commentsCount: -1 } }
            });
        }

        return { message: "Comment deleted successfully" };
    }
}