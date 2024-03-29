import { writeConcern } from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

type Workout = {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser;
  user: IUser;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
};

export type IWorkout = Document & Workout;

const WorkoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
      index: true,
      default: true,
    },
    removedAt: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    collection: 'Workout',
    writeConcern,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const WorkoutModel = model<IWorkout>('Workout', WorkoutSchema);

export default WorkoutModel;
