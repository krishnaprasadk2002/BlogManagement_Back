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

    async createBlog(blogData: IBlog): Promise<string> {
        try {
            const newBlog = new Blogs(blogData);
            await newBlog.save();

            return "Blog created successfully!";
        } catch (error) {
            console.error("Error creating blog:", error);
            throw handleThrowError("Error creating blog", 500);
        }
    }
}