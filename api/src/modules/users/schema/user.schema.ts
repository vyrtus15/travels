import * as mongoose from 'mongoose';
import * as passport from 'passport-local-mongoose';
import * as uuid from 'uuid/v4';
import { SchemaNames } from '../../../common/schemas';
import { User } from './user.interface';

export const UsersSchema = new mongoose.Schema<User>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuid,
  },

  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  roles: {
    type: [String],
    required: true,
  },
});

UsersSchema.pre('remove', async function deleteUserTravels() {
  // Delete user related travels
  await this.model(SchemaNames.Travels).deleteMany({ userId: this.id }).exec();
});

export function buildUserSchema() {
  return UsersSchema.plugin(passport, {
    usernameField: 'userName',
    usernameLowerCase: 'true',
  });
}
