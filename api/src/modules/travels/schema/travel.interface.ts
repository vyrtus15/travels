import { Document } from 'mongoose';

export interface Travel extends Document {
  id: string;
  userId: string;

  startDate: Date;
  endDate: Date;
  destination: string;
  comment: string;
}
