import type { GraphQLContext } from '@gymang/core';
import { isLoggedIn } from '@gymang/core';
import {
  connectionArgs,
  connectionFromArray,
  NullConnection,
} from '@gymang/graphql';
import type { IWorkoutSplit } from '@gymang/workout-split';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import { RecordConnection } from './RecordType';

type RecordConnectionArgs = ConnectionArguments;

export const recordConnectionField = <T extends IWorkoutSplit>(
  customResolver = null,
) => ({
  records: {
    type: new GraphQLNonNull(RecordConnection.connectionType),
    args: {
      ...connectionArgs,
    },
    resolve: (obj: T, args: RecordConnectionArgs, context: GraphQLContext) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      return connectionFromArray({
        data: obj.records,
        args,
      });
    },
  },
});
