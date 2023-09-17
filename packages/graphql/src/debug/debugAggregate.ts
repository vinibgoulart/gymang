import util from 'util';

import { Model } from 'mongoose';

const debugWithMessage = (message = '', data: any) => {
  // eslint-disable-next-line
  console.log(message, util.inspect(data, false, null, true));
};

export const debugAggregate = async (model: Model, pipeline: any[]) => {
  for (let i = 1; i < pipeline.length + 1; i++) {
    const p = pipeline.slice(0, i);

    const result = await model.aggregate(p).allowDiskUse(true);

    debugWithMessage('Aggregation step:', p);
    debugWithMessage('Result:', result);
  }
};
