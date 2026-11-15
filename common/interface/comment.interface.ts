import mongoose from "mongoose";

export interface IComment {
    content: string;
    user: mongoose.Types.ObjectId; 
    post: mongoose.Types.ObjectId; 
    createdAt?: Date;
    updatedAt?: Date;
}