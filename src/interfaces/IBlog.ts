import mongoose from "mongoose";

export interface IBlog {
    _id?: string;                 
    title: string;               
    category: string;           
    content: string;           
    image: string
    tags: string[];               
    authorId: mongoose.Types.ObjectId;              
    createdAt?: Date;             
    updatedAt?: Date;              
  }
  