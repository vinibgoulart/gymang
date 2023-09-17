import { ConnectionArguments } from 'graphql-relay';

/**
 * Calculate offsets
 */
export const base64 = (str: string): string =>
  Buffer.from(str, 'ascii').toString('base64');
export const unbase64 = (b64: string): string =>
  Buffer.from(b64, 'base64').toString('ascii');
/**
 * Rederives the offset from the cursor string
 */
export const cursorToOffset = (prefix: string, cursor: string): number =>
  parseInt(unbase64(cursor).substring(prefix.length), 10);
/**
 * Creates the cursor string from an offset.
 */
export const offsetToCursor = (prefix: string, offset: number): string =>
  base64(prefix + offset);
/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
export const getOffsetWithDefault = (
  prefix: string,
  cursor: string | undefined,
  defaultOffset: number,
): number => {
  if (!cursor && cursor !== 0) {
    return defaultOffset;
  }
  const offset = cursorToOffset(prefix, cursor);
  return Number.isNaN(offset) ? defaultOffset : offset;
};
export type OffsetsOptions = {
  args: ConnectionArguments;
  totalCount: number;
};
export type Offsets = {
  first?: number;
  last?: number;
  before: string | undefined;
  after: string | undefined;
  skip: number;
  limit: number;
  beforeOffset: number;
  afterOffset: number;
  startOffset: number;
  endOffset: number;
};
export const calculateOffsets = (
  prefix: string,
  { args, totalCount }: OffsetsOptions,
): Offsets => {
  const { after, before } = args;
  let { first, last } = args;

  // Limit the maximum number of elements in a query
  if (!first && !last) {
    first = 10;
  }
  if (first > 1000) {
    first = 1000;
  }
  if (last > 1000) {
    last = 1000;
  }

  const beforeOffset = getOffsetWithDefault(prefix, before, totalCount);
  const afterOffset = getOffsetWithDefault(prefix, after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(totalCount, beforeOffset);

  if (first !== undefined) {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (last !== undefined) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  const skip = Math.max(startOffset, 0);

  const limit = endOffset - startOffset;

  return {
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
  };
};
