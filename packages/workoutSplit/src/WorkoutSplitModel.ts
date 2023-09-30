import { WORKOUT_SPLIT_MODALITY } from '@gymang/enums';
import { writeConcern } from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import type { IWorkout } from '@gymang/workout';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';


type WorkoutSplit = {
  _id: Types.ObjectId;
  name: string;
  user: IUser;
  workout: IWorkout;
  modality: keyof typeof WORKOUT_SPLIT_MODALITY;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
};

export type IWorkoutSplit = Document & WorkoutSplit;

const WorkoutSplitSchema = new Schema<IWorkoutSplit>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workout: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
      index: true,
    },
    modality: {
      type: String,
      enum: WORKOUT_SPLIT_MODALITY,
      required: true,
      index: true,
    },
    removedAt: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    collection: 'WorkoutSplit',
    writeConcern,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const WorkoutSplitModel = model<IWorkoutSplit>(
  'WorkoutSplit',
  WorkoutSplitSchema,
);

export default WorkoutSplitModel;
