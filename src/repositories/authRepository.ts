import { handleThrowError } from "../configs/errorHandle";
import { IUser } from "../interfaces/IUser";
import Users from "../models/userModel";

export class AuthRepository {
    constructor() { }

    async findByEmail(email: string) {
        try {
            const user = await Users.findOne({ email: email });
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            handleThrowError("Error finding user by email", 500);
        }
    }
    
    async createUser(user: IUser) {
        try {
            const newUser = new Users(user);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            handleThrowError("Error creating user", 500);
        }
    }
    
}