import { writeConcern } from '@gymang/graphql';
import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

type Record = {
  createdAt: Date;
  finishedAt: Date;
};

export type IRecord = Record & Document;

export const RecordSchema = new Schema<IRecord>(
  {
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
