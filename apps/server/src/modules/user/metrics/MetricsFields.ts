import type { GraphQLContext } from '@gymang/core';
import { isLoggedIn } from '@gymang/core';
import {
  connectionArgs,
  connectionFromArray,
  NullConnection,
} from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import { MetricsConnection } from './MetricsType';

type MetricsConnectionArgs = ConnectionArguments;

export const metricsConnectionField = <T extends IUser>(
  customResolver = null,
) => ({
  metrics: {
    type: new GraphQLNonNull(MetricsConnection.connectionType),
    args: {
      ...connectionArgs,
    },
    resolve: (obj: T, args: MetricsConnectionArgs, context: GraphQLContext) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      return connectionFromArray({
        data: obj.metrics || [],
        args,
      });
    },
  },
});
