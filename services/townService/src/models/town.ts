import mongoose, { Schema } from 'mongoose';
import ITown from '../interfaces/town';

const TownSchema: Schema = new Schema(
  {
    coveyTownId: { type: String, required: true, max: 20, unique: true },
    userId: { type: String, required: true },
    townUpdatePassword: { type: String, required: true },
    isPublic: { type: Boolean, required: true },
    friendlyName: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITown>('Town', TownSchema);
