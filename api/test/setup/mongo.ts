import * as assert from 'assert';
import * as mongoose from 'mongoose';
import { RoleType } from '../../src/common/roleType';
import { User } from '../../src/modules/users/schema/user.interface';

const UserSchema = new mongoose.Schema({
  id: String,
  roles: [String],
});

const User = mongoose.model<User>('users', UserSchema, 'users');

export async function connectMongo() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}

export async function updateRole(userId: string, roles: RoleType[]) {
  const user = await User.findOne({ id: userId }).exec();
  assert.ok(user);

  user.roles = roles;
  await user.save();

  return user;
}
