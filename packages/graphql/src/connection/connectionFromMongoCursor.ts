import { ConnectionArguments } from 'graphql-relay';
import mongoose, { Query } from 'mongoose';
import apm from 'elastic-apm-node';

import { timeSpan } from '../perf/timeSpan';

type ObjectId = mongoose.Schema.Types.ObjectId;

export const PREFIX = 'mongo:';

export const base64 = (str: string): string =>
  Buffer.from(str, 'ascii').toString('base64');
export const unbase64 = (b64: string): string =>
  Buffer.from(b64, 'base64').toString('ascii');

/**
 * Rederives the offset from the cursor string
 */
export const cursorToOffset = (cursor: string): number =>
  parseInt(unbase64(cursor).substring(PREFIX.length), 10);

// TODO - discuss this used when we want to query for a total count
const LARGE_TOTAL_COUNT = 999999;
/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
export const getOffsetWithDefault = (
  cursor: string | null,
  defaultOffset: number,
): number => {
  if (cursor === undefined || cursor === null) {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return Number.isNaN(offset) ? defaultOffset : offset;
};

/**
 * Creates the cursor string from an offset.
 */
export const offsetToCursor = (offset: number): string =>
  base64(PREFIX + offset);

export type TotalCountOptions = {
  cursor: Query<any>;
  useEstimatedCount?: boolean;
  lean: boolean;
};

export const getTotalCount = async ({
  cursor,
  useEstimatedCount = false,
  lean = true,
}: TotalCountOptions): Promise<number> => {
  const clonedCursor = lean
    ? cursor.model.find().lean().merge(cursor)
    : cursor.model.find().merge(cursor);

  return useEstimatedCount
    ? clonedCursor.estimatedDocumentCount()
    : clonedCursor.countDocuments();
};

export type OffsetOptions = {
  // Connection Args
  args: ConnectionArguments;
  // total Count
  totalCount: number;
};

export type PageInfoOffsets = {
  before: string | null;
  after: string | null;
  first: number | null;
  last: number | null;
  afterOffset: number;
  beforeOffset: number;
  startOffset: number;
  endOffset: number;
  startCursorOffset: number;
  endCursorOffset: number;
};

export type Offsets = PageInfoOffsets & {
  skip: number;
  limit: number;
};

export type PageInfoOptions<NodeType> = PageInfoOffsets & {
  edges: {
    cursor: string;
    node: NodeType;
  }[];
  totalCount: number | null;
};

export const calculateOffsets = ({
  args,
  totalCount,
}: OffsetOptions): Offsets => {
  const { after, before } = args;
  let { first, last } = args;

  // Limit the maximum number of elements in a query
  if (!first && !last) first = 10;
  if (first && first > 1000) first = 1000;
  if (last && last > 1000) last = 1000;

  const beforeOffset = getOffsetWithDefault(
    before || null,
    totalCount === null ? LARGE_TOTAL_COUNT : totalCount,
  );
  const afterOffset = getOffsetWithDefault(after || null, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = totalCount
    ? Math.min(totalCount, beforeOffset)
    : beforeOffset;

  if (first !== undefined && first !== null) {
    endOffset = Math.min(endOffset, startOffset + first);
  }

  if (last !== undefined && last !== null) {
    startOffset = Math.max(startOffset, endOffset - (last || 0));
  }

  const skip = Math.max(startOffset, 0);

  const safeLimit = Math.max(endOffset - startOffset, 1);
  const limitOffset = Math.max(endOffset - startOffset, 0);

  return {
    first: first || null,
    last: last || null,
    before: before || null,
    after: after || null,
    skip,
    limit: safeLimit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    startCursorOffset: skip,
    endCursorOffset: limitOffset + skip,
  };
};

export function getPageInfo<NodeType>({
  edges,
  // before,
  // after,
  // first,
  // last,
  // afterOffset,
  // beforeOffset,
  startOffset,
  endOffset,
  totalCount,
  startCursorOffset,
  endCursorOffset,
}: PageInfoOptions<NodeType>) {
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  // const lowerBound = after ? afterOffset + 1 : 0;
  // const upperBound = before ? Math.min(beforeOffset, totalCount) : totalCount;

  const limit = endOffset - startOffset;

  const hasNextPageWithoutTotalCount = edges.length >= limit;
  const hasNextPageWithTotalCount = totalCount
    ? endCursorOffset < totalCount
    : false;

  // const hasNextPageWithTotalCount = first !== null ? endOffset < upperBound : false;

  const hasNextPage =
    totalCount !== null
      ? hasNextPageWithTotalCount
      : hasNextPageWithoutTotalCount;

  // hasNextPage: endCursorOffset < totalCount,

  return {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: startCursorOffset > 0,
    hasNextPage,
    // hasPreviousPage: last !== null ? startOffset > lowerBound : false,
    // hasNextPage: first !== null ? endOffset < upperBound : false,
  };
}

export type ConnectionOptionsCursor<LoaderResult, Ctx> = {
  cursor: Query<any>;
  context: Ctx;
  args: ConnectionArguments;
  loader: (ctx: Ctx, id: string | ObjectId | object) => LoaderResult;
  raw?: boolean; // loader should receive raw result
  useEstimatedCount?: boolean;
  lean?: boolean;
  shouldCount?: boolean;
};

export const connectionFromMongoCursor = async <LoaderResult, Ctx>({
  cursor,
  context,
  args = {},
  loader,
  raw = false,
  lean = true,
  useEstimatedCount = false,
  shouldCount = false,
}: ConnectionOptionsCursor<LoaderResult, Ctx>) => {
  const clonedCursor = lean
    ? cursor.model.find().lean().merge(cursor)
    : cursor.model.find().merge(cursor);

  let totalCount = null;

  if (shouldCount) {
    const timespanKey = `connectionFromMongoCursor-totalCount-${cursor.model.collection.collectionName}`;
    const span = apm.startSpan(timespanKey);

    const end = timeSpan();

    totalCount = await getTotalCount({
      cursor: clonedCursor,
      useEstimatedCount,
      lean,
    });

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
  clonedCursor.skip(skip);
  clonedCursor.limit(limit);

  const timespanKey = `connectionFromMongoCursor-${cursor.model.collection.collectionName}`;
  const span = apm.startSpan(timespanKey);

  const end = timeSpan();
  // avoid large objects retrieval from collection
  const slice: { _id: ObjectId }[] = await clonedCursor
    .select(raw ? {} : { _id: 1 })
    .exec();

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
    node: loader(context, raw ? value : value._id),
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
