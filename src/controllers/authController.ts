import { AuthServices } from "../services/authService";
import { Request, Response, NextFunction } from 'express';
import { handleError, handleSuccess } from "../utils/responseHandler";
import { HttpStatusCode } from "../enums/httpStatusCode";
import { authenticatedRequest } from "../middlewares/accessToken";


export class AuthController {
    constructor(private authService: AuthServices) { }

    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, mobile, password } = req.body;

            if (!name || !email || !mobile || !password) {
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError('All fields are required', 400));
                return
            }

            const message = await this.authService.registerUser({ name, email, mobile, password });
            const response = handleSuccess('User registered successfully!', 201, message);
            res.status(response.statusCode).json(response);
            return

        } catch (error) {
            next(error);
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError('Email and password are required', 400));
                return;
            }

            const response = await this.authService.loginUsers(email, password)

            // Set JWT token in an HttpOnly cookie for security
            res.cookie('token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000
            });

            res.status(HttpStatusCode.OK).json(handleSuccess('Login successful!', 200, {
                message: response.message,
                token: response.token
            }));
        } catch (error) {
            next(error)
        }
    }


    async isAuth(req: authenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'User not authenticated' });
                return
            }
            res.status(HttpStatusCode.OK).json({ message: 'Success' });
        } catch (error) {
            next(error);
        }
    }

    async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await res.clearCookie('token', {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
            });

            // Respond with success message
            res.status(200).json({ message: 'Successfully logged out' });
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ message: 'Failed to log out' });
        }
    }



}