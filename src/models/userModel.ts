import mongoose, { Schema } from "mongoose";

// interfaces
import { IUser } from "../interfaces/IUser";

const userSchema: Schema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Users = mongoose.model<IUser>('Users', userSchema);

export default Users;
