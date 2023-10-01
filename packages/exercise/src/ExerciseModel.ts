import { writeConcern } from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import type { IWorkoutSplit } from '@gymang/workout-split';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

type Exercise = {
  _id: Types.ObjectId;
  name: string;
  user: IUser;
  workoutSplit: IWorkoutSplit;
  series: string;
  repetitions: string;
  weight?: string;
  breakTime?: string;
  muscleGroup?: string;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
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
      index: true,
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
