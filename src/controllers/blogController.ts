import { Request, Response } from "express";
import { BlogServices } from "../services/blogService";
import { NextFunction } from "express-serve-static-core";
import { authenticatedRequest } from "../middlewares/accessToken";
import { HttpStatusCode } from "../enums/httpStatusCode";
import { handleError, handleSuccess } from "../utils/responseHandler";
import mongoose from "mongoose";


export class BlogController {
    constructor(private blogService: BlogServices) { }

    // Get User Details
    async getUserDetails(req: authenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId as string;
            if (!userId) {
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError('User ID not provided', 400));
                return;
            }

            const response = await this.blogService.getUserDetails(userId);
            if (!response) {
                res.status(HttpStatusCode.NOT_FOUND).json(handleError('User details not found', 404));
                return;
            }
            res.status(HttpStatusCode.OK).json(handleSuccess('User details retrieved successfully', 200, {
                data: response.data,
            }));
        } catch (error) {
            next(error);
        }
    }

    async createBlog(req: authenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = req.user?.userId;
            if (!authorId) {
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError('User ID not provided', 400));
                return
            }

            const { title, category, content, image, tags } = req.body;

            if (!title || !category || !content || !image || !tags) {
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError('All fields are required', 400));
                return
            }

            const blogData = {
                title,
                category,
                content,
                image,
                authorId: new mongoose.Types.ObjectId(authorId),
                tags,
            };

            const createdBlog = await this.blogService.createBlog(blogData);

            if (!createdBlog) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError('Failed to create blog', 500));
                return
            }

            res.status(HttpStatusCode.CREATED).json(handleSuccess('Blog created successfully', 201, createdBlog));
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError('Internal server error', 500));
        }
    }
}
