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
  async createBlog(blogData: IBlog): Promise<{ message: string; data: IBlog }> {
    try {
      const imageUrl = await uploadCloudinary(blogData.image);

      if (!imageUrl) {
        throw handleThrowError("Error uploading image to Cloudinary", 400);
      }

      const blogDataWithImage = { ...blogData, image: imageUrl };

      const existingBlog = await this.blogRep.findOneByTitle(blogDataWithImage.title);
      if (existingBlog) {
        throw handleThrowError("Blog already exists", 400);
      }

      const newBlog = await this.blogRep.createBlog(blogDataWithImage);

      return {
        message: "Blog created successfully!",
        data: newBlog,
      };
    } catch (error) {
      console.error("Error during blog creation:", error);
      throw handleThrowError("An error occurred during blog creation", 500);
    }
  }

  async getBlogDetails(authorId: string): Promise<{ data: IBlog[] } | null> {
    try {
      const blogData = await this.blogRep.findAllBlogs(authorId);

      if (blogData.length === 0) {
        return null;
      }

      return { data: blogData };
    } catch (error) {
      console.error('Error fetching blog details:', error);
      throw handleThrowError('Error fetching blog details', 500);
    }
  }

  async blogDataById(blogId: string): Promise<{ data: IBlog } | null> {
    try {
      const blogData = await this.blogRep.findBlogById(blogId);

      if (!blogData) {
        return null;
      }

      return { data: blogData };
    } catch (error) {
      console.error("Error fetching blog details:", error);
      throw handleThrowError("Error fetching blog details", 500);
    }
  }


  async updateBlog(blogData: IBlog): Promise<IBlog | null> {
    try {

      let imageUrl = blogData.image;
      if (blogData.image) {
        imageUrl = await uploadCloudinary(blogData.image);
        if (!imageUrl) {
          throw handleThrowError("Error uploading image to Cloudinary", 400);
        }
      }

      if (imageUrl) {
        blogData.image = imageUrl;
      }

      const updatedBlog = await this.blogRep.updateBlog(blogData._id!, blogData);
      return updatedBlog;
    } catch (error) {
      console.error('Error in service layer:', error);
      throw handleThrowError('Error updating blog', 500);
    }
  }

  async deleteBlogById(blogId: string): Promise<IBlog | null> {
    try {
      const deletedBlog = await this.blogRep.deleteBlogById(blogId);
      return deletedBlog;
    } catch (error) {
      console.error('Error in deleteBlogById service:', error);
      throw handleThrowError('Error deleting blog', 500);
    }
  }


}