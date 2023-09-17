import { ResponsePath, responsePathAsArray, GraphQLType } from 'graphql';

import { debugConsole } from '../debug/debugConsole';

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

const formatTracing = ({
  startWallTime,
  endWallTime,
  duration,
  resolverCalls,
}) => ({
  version: 1,
  startTime: startWallTime.toISOString(),
  endTime: endWallTime.toISOString(),
  duration: durationHrTimeToNanos(duration),
  execution: {
    resolvers: resolverCalls.map((resolverCall) => {
      const startOffset = durationHrTimeToNanos(resolverCall.startOffset);
      const durationNano = resolverCall.endOffset
        ? durationHrTimeToNanos(resolverCall.endOffset) - startOffset
        : 0;

      return {
        path: [...responsePathAsArray(resolverCall.path)],
        parentType: resolverCall.parentType.toString(),
        fieldName: resolverCall.fieldName,
        returnType: resolverCall.returnType.toString(),
        startOffset,
        duration: durationNano,
        durationMilli: durationNano / 1e6,
        durationSeconds: durationNano / 1e9,
      };
    }),
  },
});

type ResolverCall = {
  path: ResponsePath;
  fieldName: string;
  parentType: GraphQLType;
  returnType: GraphQLType;
  startOffset: HighResolutionTime;
  endOffset?: HighResolutionTime;
};
export const traceResolver =
  (resolver) => async (source, args, context, info) => {
    // requestDidStart
    const startWallTime = new Date();
    const startHrTime = process.hrtime();

    // executionDidStart
    const duration = process.hrtime(startHrTime);
    const endWallTime = new Date();

    const resolverCall: ResolverCall = {
      path: info.path,
      fieldName: info.fieldName,
      parentType: info.parentType,
      returnType: info.returnType,
      startOffset: process.hrtime(startHrTime),
    };

    // willResolveField
    const result = await resolver(source, args, context, info);

    resolverCall.endOffset = process.hrtime(startHrTime);

    debugConsole(
      formatTracing({
        startWallTime,
        endWallTime,
        duration,
        resolverCalls: [resolverCall],
      }),
    );

    return result;
  };
