import express from 'express';
import { BlogRepository } from '../repositories/blogRepository';
import { BlogServices } from '../services/blogService';
import { BlogController } from '../controllers/blogController';
import { authenticateToken } from '../middlewares/accessToken';

const blogRepository = new BlogRepository();
const blogService = new BlogServices(blogRepository);
const blogController = new BlogController(blogService);
const blogRoute = express.Router()

blogRoute.get('/userDetails',authenticateToken,(req,res,next)=>blogController.getUserDetails(req,res,next))
blogRoute.post('/createBlog',authenticateToken,(req,res,next)=>blogController.createBlog(req,res,next))

export default blogRoute