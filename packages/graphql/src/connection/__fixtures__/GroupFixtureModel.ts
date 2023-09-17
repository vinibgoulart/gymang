import type { Document, Model, Types } from 'mongoose';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const GroupFixtureSchema = new mongoose.Schema(
  {
    name: String,
    users: [
      {
        type: ObjectId,
        ref: 'UserFixture',
      },
    ],
  },
  {
    collection: 'GroupFixture',
  },
);

export type IGroupFixture = {
  name: string;
  users: Types.ObjectId[];
} & Document;

const GroupFixtureModel: Model<IGroupFixture> = mongoose.model(
  'GroupFixture',
  GroupFixtureSchema,
);

export default GroupFixtureModel;
