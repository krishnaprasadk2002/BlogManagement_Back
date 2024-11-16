// ErrorHandle.ts
class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);

        this.statusCode = statusCode;
        this.isOperational = true;  // Operational errors are expected errors, e.g. bad input
    }
}

export default AppError;

export const handleThrowError = (message: string, statusCode: number) => {
    throw new AppError(message, statusCode);
};
