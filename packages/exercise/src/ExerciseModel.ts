import { MUSCLE_GROUP } from '@gymang/enums';
import { writeConcern } from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import type { IWorkoutSplit } from '@gymang/workout-split';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

import type { ISession } from './session/SessionSchema';
import { SessionSchema } from './session/SessionSchema';

type Exercise = {
  _id: Types.ObjectId;
  name: string;
  user: IUser;
  workoutSplit: IWorkoutSplit;
  series: string;
  repetitions: string;
  weight?: string;
  breakTime?: string;
  muscleGroup: keyof typeof MUSCLE_GROUP;
  sessions: ISession[];
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
  startSession: () => unknown;
};

export type IExercise = Document & Exercise;

const ExerciseSchema = new Schema<IExercise>(
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
    workoutSplit: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutSplit',
      required: true,
      index: true,
    },
    series: {
      type: String,
      required: true,
      index: true,
    },
    repetitions: {
      type: String,
      required: true,
      index: true,
    },
    weight: {
      type: String,
      index: true,
    },
    breakTime: {
      type: String,
      index: true,
    },
    muscleGroup: {
      type: String,
      enum: MUSCLE_GROUP,
      required: true,
      index: true,
    },
    sessions: {
      type: [SessionSchema],
      default: [],
    },
    removedAt: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    collection: 'Exercise',
    writeConcern,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const ExerciseModel = model<IExercise>('Exercise', ExerciseSchema);

export default ExerciseModel;
