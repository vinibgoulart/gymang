import type { Model } from 'mongoose';

export const withAggregate =
  (model: Model<any>, pipeFn: (...p: any[]) => any[]) =>
  (...params: any[]) => {
    const aggregatePipeline = pipeFn(...params);

    return model.aggregate(aggregatePipeline).allowDiskUse(true);
  };
