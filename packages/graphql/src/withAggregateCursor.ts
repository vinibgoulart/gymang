import type { Model } from 'mongoose';

export const withAggregateCursor =
  (model: Model<any>, pipeFn: (...p: any[]) => any[]) =>
  (...params: any[]) => {
    const aggregatePipeline = pipeFn(...params);

    // TODO - remove .cursor from here, let cursorProcessing handle this instead with batchSize
    return model.aggregate(aggregatePipeline).allowDiskUse(true).cursor();
  };
