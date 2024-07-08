import { writeConcern } from '@gymang/graphql';
import type { IPersonal } from '@gymang/personal';
import type { IUser } from '@gymang/user';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

import { WORKOUT_STATUS_ENUM } from './WorkoutStatusEnum';

type Workout = {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser;
  user: IUser;
  isPublic: boolean;
  status: WORKOUT_STATUS_ENUM;
  approvedBy?: IPersonal;
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
    status: {
      type: String,
      required: true,
      index: true,
      enum: WORKOUT_STATUS_ENUM,
      default: WORKOUT_STATUS_ENUM.APPROVED,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Personal',
      index: true,
      default: null,
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
