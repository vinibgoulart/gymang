import type { Model } from 'mongoose';

import { connectionFromMongoAggregate } from './connection/connectionFromMongoAggregate';
import { NullConnection } from './connection/NullConnection';
import { infoHasOneOfFields } from './fields/getFieldsByInfo';
import type { LoaderFn } from './types';

export const withConnectionAggregate =
  (
    model: Model<any>,
    loader: LoaderFn,
    pipeFn: (...p: any[]) => any[],
    viewerCanSee?: (context: any) => boolean,
  ) =>
  async (...params: any[]) => {
    const aggregatePipeline = pipeFn(...params);

    // expect context and then args as params
    const [context, args, info, bypassViewerCanSee] = params;

    if (viewerCanSee && !bypassViewerCanSee) {
      if (!viewerCanSee(context)) {
        return NullConnection;
      }
    }

    // await debugAggregate(model, aggregatePipeline);

    // debugConsole(aggregatePipeline);

    const shouldCount = infoHasOneOfFields(info, ['count', 'totalCount']);
    const aggregate = model.aggregate(aggregatePipeline).allowDiskUse(true);

    return connectionFromMongoAggregate({
      aggregate,
      context,
      args,
      loader,
      shouldCount,
      bypassViewerCanSee,
    });
  };
