import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, min: 5, max: 20, unique: true },
    password: { type: String, required: true, min: 6 },
    email: { type: String, max: 50, unique: true },
    profilePictureUrl: { type: String },

  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>('User', UserSchema);
