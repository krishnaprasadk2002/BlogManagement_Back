import uploadCloudinary from "../configs/cloudinary";
import { handleThrowError } from "../configs/errorHandle";
import { IBlog } from "../interfaces/IBlog";
import { IUser } from "../interfaces/IUser";
import { BlogRepository } from "../repositories/blogRepository";

export class BlogServices {
    constructor(private blogRep: BlogRepository) { }

    async getUserDetails(userId: string): Promise<{ data: IUser } | null> {
        try {
            const userData = await this.blogRep.findById(userId);

            if (!userData) {
                return null;
            }

            return { data: userData };
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw handleThrowError('Error fetching user details', 500);
        }
    }

  // Create Blog
  async createBlog(blogData: IBlog): Promise<string> {
    try {
      const imageUrl = await uploadCloudinary(blogData.image); 

      if (!imageUrl) {
        throw handleThrowError("Error uploading image to Cloudinary",400);
      }
      const blogDataWithImage = { ...blogData, imageUrl };

      const existingBlog = await this.blogRep.findOneByTitle(blogDataWithImage.title);
      if (existingBlog) {
        throw handleThrowError("Blog already exists",400);
      }

      const savedBlog = await this.blogRep.createBlog(blogDataWithImage);
      return savedBlog; 
    } catch (error) {
      console.error("Error during blog creation:", error);
      throw new Error("An error occurred during blog creation"); 
    }
  }

}