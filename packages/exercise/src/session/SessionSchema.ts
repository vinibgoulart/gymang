import { MUSCLE_GROUP } from '@gymang/enums';
import { writeConcern } from '@gymang/graphql';
import type { Document} from 'mongoose';
import { Schema } from 'mongoose';

type Session = {
  series: string;
  repetitions: string;
  weight: string;
  breakTime: string;
  muscleGroup: keyof typeof MUSCLE_GROUP;
  createdAt: Date;
  finishedAt: Date;
};

export type ISession = Session & Document;

export const SessionSchema = new Schema<ISession>(
  {
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
    finishedAt: {
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
    },
  },
);
