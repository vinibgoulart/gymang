import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

export const UserFixtureSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    collection: 'UserFixture',
  },
);

export type IUserFixture = {
  name: string;
} & Document;

const UserFixtureModel: Model<IUserFixture> = mongoose.model(
  'UserFixture',
  UserFixtureSchema,
);

export default UserFixtureModel;
