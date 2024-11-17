import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from "../enums/httpStatusCode";

export interface authenticatedRequest extends Request {
    user?: decodedUser;
}

export interface decodedUser {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

export const authenticateToken = (req: authenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    console.log("Token in cookies:", token);
    if (!token) {
        console.log("No token found, unauthorized access");
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'token') as decodedUser;
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Forbidden' });
    }
};