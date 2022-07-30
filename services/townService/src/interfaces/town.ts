import { Document } from 'mongoose';

export default interface ITown extends Document {
  coveyTownId: string;
  userId: string;
  townUpdatePassword: string;
  isPublic: boolean;
  friendlyName: string;
  capacity: string;
}