import { handleThrowError } from "../configs/errorHandle";
import { IBlog } from "../interfaces/IBlog";
import { IUser } from "../interfaces/IUser";
import Blogs from "../models/blogModel";
import Users from "../models/userModel";

export class BlogRepository {
    constructor() { }


    async findById(userId: string): Promise<IUser | null> {
        try {
            const userData = await Users.findById(userId)
            if (!userData) {
                return null;
            }
            return userData;
        } catch (error) {
            console.error("Error finding user:", error);
            throw handleThrowError("Error fetching user by ID", 500);
        }
    }

    async findOneByTitle(title: string): Promise<IBlog | null> {
        try {
            const blogData = await Blogs.findOne({ title: title })
            if (!blogData) {
                return null;
            }
            return blogData;
        } catch (error) {
            console.error("Error finding blog:", error);
            throw handleThrowError("Error fetching blog by title", 500);
        }
    }

    async createBlog(blogData: IBlog): Promise<IBlog> {
        try {
            const newBlog = new Blogs(blogData);
            const savedBlog = await newBlog.save();
            return savedBlog;
        } catch (error) {
            console.error("Error creating blog:", error);
            throw handleThrowError("Error creating blog", 500);
        }
    }

    async findAllBlogs(authorId: string): Promise<IBlog[]> {
        try {
            const blogData = await Blogs.find({ authorId: authorId });

            if (blogData.length === 0) {
                return [];
            }
            return blogData;
        } catch (error) {
            console.error("Error finding blogs:", error);
            throw handleThrowError("Error fetching blogs", 500);
        }
    }

    async findBlogById(blogId: string): Promise<IBlog | null> {
        try {
            const blogData = await Blogs.findById(blogId);
            return blogData;
        } catch (error) {
            console.error("Error finding blog:", error);
            throw handleThrowError("Error fetching blog", 500);
        }
    }

    async updateBlog(blogId: string, blogData: Partial<IBlog>): Promise<IBlog | null> {
        try {
            return await Blogs.findByIdAndUpdate(blogId, blogData, { new: true });
        } catch (error) {
            console.error('Error in repository layer:', error);
            throw handleThrowError('error updating blog details', 500);
        }
    }

    async deleteBlogById(blogId: string): Promise<IBlog | null> {
        try {
            const deletedBlog = await Blogs.findByIdAndDelete(blogId);
            return deletedBlog;
        } catch (error) {
            console.error('Error deleting blog in repository:', error);
            throw handleThrowError('Error deleting blog', 500);
        }
    }


}