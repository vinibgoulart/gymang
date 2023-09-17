/**
 * Helper to batch queries on mongoose
 */
import apm from 'elastic-apm-node';

import { timeSpan } from '../perf/timeSpan';

export const cacheKeyFn = (key: string): string => key.toString();

function indexResults(
  results: any[],
  indexField: string,
  cacheKey = cacheKeyFn,
) {
  const indexedResults = new Map();
  results.forEach((res) => {
    indexedResults.set(cacheKey(res[indexField]), res);
  });
  return indexedResults;
}

function normalizeResults(
  keys: readonly string[],
  indexField: string,
  cacheKey = cacheKeyFn,
) {
  return (results: any[]) => {
    const indexedResults = indexResults(results, indexField, cacheKey);
    return keys.map(
      (val) =>
        indexedResults.get(cacheKey(val)) ||
        new Error(`Key not found : ${val}`),
    );
  };
}

type MongooseProjection = object | string;
type Mongoose$Document = {
  find(
    criteria?: Record<string, unknown>,
    projection?: MongooseProjection,
    options?: Record<string, unknown>,
  ): any;
};

export const mongooseLoader = async (
  model: Mongoose$Document,
  keys: readonly string[],
  lean = true,
  keyField = '_id',
) => {
  const timespanKey = `mongooseLoader-${model.collection.collectionName}`;
  const span = apm.startSpan(timespanKey);

  const end = timeSpan();

  const results = lean
    ? await model.find({ [keyField]: { $in: keys } }).lean()
    : await model.find({ [keyField]: { $in: keys } });

  if (span) {
    span.end();
  }
  if (process.env.DEBUG_PERF === 'true') {
    // eslint-disable-next-line
    console.log(`${timespanKey}:${end()}`);
  }

  return normalizeResults(keys, keyField, cacheKeyFn)(results);
};
