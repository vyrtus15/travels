import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';
import { Travel } from './travel.interface';

export const TravelSchema = new Schema<Travel>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuid,
  },

  userId: {
    type: String,
    required: true,
    index: true,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    default: Date.now,
  },

  destination: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
  },
});

TravelSchema.index({ destination: 'text' }, { default_language: 'none' });
TravelSchema.index({ startDate: 1 });
TravelSchema.index({ endDate: 1 });