import apm from 'elastic-apm-node';
import type { Model } from 'mongoose';

export const aggregateApm = async (M: Model<any>, pipeline: Array<any>) => {
  const spanName = `${M.collection.collectionName}.aggregate`;
  const span = apm.startSpan(spanName);

  if (span) {
    span.setLabel('pipeline', JSON.stringify(pipeline));
  }

  const result = await M.aggregate(pipeline).allowDiskUse(true);

  if (span) {
    span.end();
  }

  return result;
};

// this do not work, we need to use .bind to get this
export const monkeyPatchAggregateApm = (M: Model<any>) => {
  const aggregate = M.aggregate;

  M.aggregate = async (pipeline: Array<any>) => {
    const spanName = `${M.collection.collectionName}.aggregate`;
    const span = apm.startSpan(spanName);

    if (span) {
      span.setLabel('pipeline', JSON.stringify(pipeline));
    }

    const result = await aggregate(pipeline).allowDiskUse(true);

    if (span) {
      span.end();
    }

    return result;
  };

  return M;
};
