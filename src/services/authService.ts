import { IUser } from "../interfaces/IUser";
import { AuthRepository } from "../repositories/authRepository";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { handleThrowError } from "../configs/errorHandle";
import jwt from 'jsonwebtoken';

export class AuthServices {
    constructor(private authRep: AuthRepository) {}

    async registerUser(user: IUser): Promise<string> {
        try {
            const existingUser = await this.authRep.findByEmail(user.email);
            if (existingUser) {
               throw handleThrowError("Email already exists", 400);
            }

            const hashedPassword = await hashPassword(user.password);
            user.password = hashedPassword;

            await this.authRep.createUser(user);

            return "User registered successfully!";
        } catch (error) {
            throw handleThrowError("An error occurred during user registration", 500);
        }
    }

    async loginUsers(email: string, password: string): Promise<{ message: string, token: string }> {
        try {
            const user = await this.authRep.findByEmail(email);

            if (!user) {
                throw handleThrowError("Invalid credentials. User not found", 401);
            }

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw handleThrowError("Invalid credentials. Incorrect password", 401);
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET || 'Token', 
                { expiresIn: '15m' }
            );

            return {
                message: "Login successful!",
                token: token
            };
        } catch (error) {
            throw handleThrowError("An error occurred during login", 500);
        }
    }
}
