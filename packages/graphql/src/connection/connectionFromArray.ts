import {
  Connection,
  ConnectionArguments,
  connectionFromArray as relayConnectionFromArray,
} from 'graphql-relay';

const unbase64 = (b64: string): string =>
  Buffer.from(b64, 'base64').toString('ascii');

const getCursorOffset = (cursor: string): string =>
  unbase64(cursor).split(':').pop();

type CustomConnection<T> = {
  count: number;
  startCursorOffset: number;
  endCursorOffset: number;
} & Connection<T>;
type ConnectionFromArrayArgs<T, Context> = {
  data: T[];
  args: ConnectionArguments;
};

export const connectionFromArray = <T, Context>({
  data,
  args,
}: ConnectionFromArrayArgs<T, Context>): CustomConnection<T> => {
  const connection = relayConnectionFromArray(data, args);
  const { startCursor, endCursor } = connection.pageInfo;

  const endCursorOffset =
    parseInt(getCursorOffset(endCursor || 'MA=='), 10) + 1;

  const startCursorOffset = parseInt(
    getCursorOffset(startCursor || 'MA=='),
    10,
  );

  return {
    ...connection,
    count: data.length,
    startCursorOffset,
    endCursorOffset,
  };
};
