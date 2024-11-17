export interface IUser {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
