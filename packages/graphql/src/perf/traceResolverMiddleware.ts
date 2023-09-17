import { ResponsePath, responsePathAsArray, GraphQLType } from 'graphql';
import apm from 'elastic-apm-node';

// based on apollo-tracing
// https://github.com/apollographql/apollo-server/blob/master/packages/apollo-tracing/src/index.ts

type HighResolutionTime = [number, number];

// Converts an hrtime array (as returned from process.hrtime) to nanoseconds.
//
// ONLY CALL THIS ON VALUES REPRESENTING DELTAS, NOT ON THE RAW RETURN VALUE
// FROM process.hrtime() WITH NO ARGUMENTS.
//
// The entire point of the hrtime data structure is that the JavaScript Number
// type can't represent all int64 values without loss of precision:
// Number.MAX_SAFE_INTEGER nanoseconds is about 104 days. Calling this function
// on a duration that represents a value less than 104 days is fine. Calling
// this function on an absolute time (which is generally roughly time since
// system boot) is not a good idea.
const durationHrTimeToNanos = (hrtime: HighResolutionTime) =>
  hrtime[0] * 1e9 + hrtime[1];

type ResolverCall = {
  path: ResponsePath;
  fieldName: string;
  parentType: GraphQLType;
  returnType: GraphQLType;
  startOffset: HighResolutionTime;
  endOffset?: HighResolutionTime;
};
export const traceResolveMiddleware = async (
  source,
  args,
  context,
  info,
  next,
) => {
  const startHrTime = process.hrtime();

  const resolverCall: ResolverCall = {
    path: info.path,
    fieldName: info.fieldName,
    parentType: info.parentType,
    returnType: info.returnType,
    startOffset: process.hrtime(startHrTime),
  };

  const timespanKey = responsePathAsArray(resolverCall.path).join('.');

  let span = null;
  if (process.env.DEBUG === 'true') {
    span = apm.startSpan(timespanKey);
  }

  // willResolveField
  const result = await next();

  if (span) {
    span.end();
  }

  resolverCall.endOffset = process.hrtime(startHrTime);

  const startOffset = durationHrTimeToNanos(resolverCall.startOffset);
  const durationNano = resolverCall.endOffset
    ? durationHrTimeToNanos(resolverCall.endOffset) - startOffset
    : 0;

  const durationMilli = durationNano / 1e6;
  const path = responsePathAsArray(resolverCall.path).join('.');

  if (process.env.DEBUG_PERF === 'true') {
    // eslint-disable-next-line
    console.log(`${path}:${durationMilli}`);
  }

  return result;
};
