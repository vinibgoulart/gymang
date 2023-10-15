import { writeConcern } from '@gymang/graphql';
import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

type Session = {
  series: string;
  repetitions: string;
  weight: string;
  breakTime: string;
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
