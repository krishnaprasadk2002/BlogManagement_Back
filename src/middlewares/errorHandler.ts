import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpStatusCode } from '../enums/httpStatusCode';

// Define the custom error interface
export interface ErrorWithStatusCode extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    if (err.isOperational) {
        res.status(err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};

export default globalErrorHandler;
