import { writeConcern } from '@gymang/graphql';
import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

type Metrics = {
  weight: number;
  height: number;
  age: string;
  fat?: string;
  createdAt: Date;
};

export type IMetrics = Metrics & Document;

export const MetricsSchema = new Schema<IMetrics>(
  {
    weight: {
      type: Number,
      required: true,
      index: true,
    },
    height: {
      type: Number,
      required: true,
      index: true,
    },
    age: {
      type: String,
      required: true,
      index: true,
    },
    fat: {
      type: String,
      index: true,
    },
  },
  {
    collection: 'Metrics',
    writeConcern,
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);
