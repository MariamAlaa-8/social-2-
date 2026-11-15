import mongoose from "mongoose";

export interface IPost {
    content?: string;
    image?: string;
    user: mongoose.Types.ObjectId; 
    commentsCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}