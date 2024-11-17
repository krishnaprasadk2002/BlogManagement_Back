import express from 'express';
import { AuthRepository } from '../repositories/authRepository';
import { AuthServices } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/accessToken';


const authRepository = new AuthRepository();
const authService = new AuthServices(authRepository);
const authController = new AuthController(authService);

const authRoute = express.Router();

authRoute.post('/register', (req, res, next) => authController.registerUser(req, res, next));
authRoute.post('/login', (req, res, next) => authController.loginUser(req, res, next));
authRoute.get('/isAuth', authenticateToken, (req, res, next) => authController.isAuth(req, res, next));
authRoute.get('/logOut', (req, res, next) => authController.logoutUser(req, res, next));

export default authRoute;