import mongoose, {Schema} from 'mongoose';
import ITown from '../interfaces/town'

const TownSchema: Schema = new Schema(
  {
    coveyTownId: { type: String, required: true, max: 20, unique: true },
    userId: { type: String, required: true },
    townUpdatePassword: { type: String, required: true, max: 20 },
    isPublic: { type: Boolean, required: true },
    friendlyName: { type: String, required: true, max: 10 },
    capacity: { type: Number, required: true, max: 20 }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<ITown>('Town', TownSchema);
