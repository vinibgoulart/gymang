import type { IExercise } from '@gymang/exercise';
import { writeConcern } from '@gymang/graphql';
import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

type Record = {
  exercises: IExercise[];
  createdAt: Date;
  finishedAt: Date;
};

export type IRecord = Record & Document;

export const RecordSchema = new Schema<IRecord>(
  {
    exercises: {
      type: [Schema.Types.ObjectId],
      ref: 'Exercise',
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
