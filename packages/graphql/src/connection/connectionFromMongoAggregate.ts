import apm from 'elastic-apm-node';
import type { ConnectionArguments } from 'graphql-relay';
import type { Aggregate } from 'mongoose';
import type mongoose from 'mongoose';

import {
  calculateOffsets,
  getPageInfo,
  offsetToCursor,
} from './connectionFromMongoCursor';
import { timeSpan } from '../perf/timeSpan';

type ObjectId = mongoose.Schema.Types.ObjectId;

const cloneAggregate = (aggregate: Aggregate<any>): Aggregate<any> =>
  aggregate._model.aggregate(aggregate.pipeline()).allowDiskUse(true);

export type ConnectionOptionsAggregate<LoaderResult, Ctx> = {
  aggregate: Aggregate<any>;
  context: Ctx;
  args: ConnectionArguments;
  loader: (
    ctx: Ctx,
    id: string | ObjectId | Record<string, any>,
    bypassViewerCanSee?: boolean,
  ) => LoaderResult;
  raw?: boolean; // loader should receive raw result
  allowDiskUse?: boolean;
  shouldCount?: boolean;
  bypassViewerCanSee?: boolean;
};

export const getTotalCount = async (
  aggregate: Aggregate<any>,
  allowDiskUse = true,
) => {
  const resultCount: { total: number }[] = await cloneAggregate(aggregate)
    .allowDiskUse(allowDiskUse)
    .count('total');

  return resultCount.length ? resultCount[0].total : 0;
};

/**
 * Your aggregate must return documents with _id fields
 *  those _id's are the ones going to be passed to the loader function
 */
export const connectionFromMongoAggregate = async <LoaderResult, Ctx>({
  aggregate,
  context,
  args = {},
  loader,
  raw = false,
  allowDiskUse = true,
  shouldCount = false,
  bypassViewerCanSee = false,
}: ConnectionOptionsAggregate<LoaderResult, Ctx>) => {
  // https://github.com/Automattic/mongoose/blob/367261e6c83e7e367cf0d3fbd2edea4c64bf1ee2/lib/aggregate.js#L46
  const clonedAggregate = cloneAggregate(aggregate).allowDiskUse(allowDiskUse);

  let totalCount = null;

  if (shouldCount) {
    const timespanKey = `connectionFromMongoAggregate-totalCount-${aggregate._model.collection.collectionName}`;
    const span = apm.startSpan(timespanKey);

    const end = timeSpan();

    totalCount = await getTotalCount(aggregate, allowDiskUse);

    if (span) {
      span.end();
    }

    if (process.env.DEBUG_PERF === 'true') {
      // eslint-disable-next-line
      console.log(`${timespanKey}:${end()}`);
    }
  }

  const {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    startCursorOffset,
    endCursorOffset,
  } = calculateOffsets({ args, totalCount });

  // If supplied slice is too large, trim it down before mapping over it.
  if (skip > 0) {
    clonedAggregate.skip(skip);
  }

  // limit should never be 0 because $slice returns an error if it is.
  clonedAggregate.limit(limit || 1);

  const timespanKey = `connectionFromMongoAggregate-${aggregate._model.collection.collectionName}`;
  const span = apm.startSpan(timespanKey);

  if (span) {
    span.setLabel('pipeline', JSON.stringify(clonedAggregate.pipeline()));
  }

  // avoid large objects retrieval from collection
  const slice: { _id: ObjectId }[] = await (raw
    ? clonedAggregate
    : clonedAggregate.project('_id'));

  const end = timeSpan();

  if (span) {
    span.end();
  }

  if (process.env.DEBUG_PERF === 'true') {
    // eslint-disable-next-line
    console.log(`${timespanKey}:${end()}`);
  }

  const edges: {
    cursor: string;
    node: LoaderResult;
  }[] = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: loader(context, raw ? value : value._id, bypassViewerCanSee),
  }));

  return {
    edges,
    count: totalCount,
    endCursorOffset,
    startCursorOffset,
    pageInfo: getPageInfo({
      edges,
      before,
      after,
      first,
      last,
      afterOffset,
      beforeOffset,
      startOffset,
      endOffset,
      totalCount,
      startCursorOffset,
      endCursorOffset,
    }),
  };
};
