import { Model } from 'mongoose';

import { LoaderFn } from './types';
import { connectionFromMongoCursor } from './connection/connectionFromMongoCursor';
import { infoHasOneOfFields } from './fields/getFieldsByInfo';

export const withConnectionCursor =
  (
    model: Model<any>,
    loader: LoaderFn,
    condFn: (...p: any[]) => {
      conditions?: Record<string, unknown>;
      sort?: Record<string, unknown>;
    },
  ) =>
  (...params: any[]) => {
    const { conditions = {}, sort = {} } = condFn(...params);

    const [context, args, info] = params;

    const shouldCount = infoHasOneOfFields(info, ['count', 'totalCount']);
    const cursor = model.find(conditions).sort(sort);

    return connectionFromMongoCursor({
      cursor,
      context,
      args,
      loader,
      shouldCount,
    });
  };
