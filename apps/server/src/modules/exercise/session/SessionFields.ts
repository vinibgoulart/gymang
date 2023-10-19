import type { GraphQLContext} from '@gymang/core';
import { isLoggedIn } from '@gymang/core';
import type { IExercise } from '@gymang/exercise';
import {
  connectionArgs,
  connectionFromArray,
  NullConnection,
} from '@gymang/graphql';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import { SessionConnection } from './SessionType';

type SessionConnectionArgs = ConnectionArguments;

export const sessionConnectionField = <T extends IExercise>(
  customResolver = null,
) => ({
  sessions: {
    type: new GraphQLNonNull(SessionConnection.connectionType),
    args: {
      ...connectionArgs,
    },
    resolve: (obj: T, args: SessionConnectionArgs, context: GraphQLContext) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      console.log({ obj: obj.sessions });

      return connectionFromArray({
        data: obj.sessions,
        args,
      });
    },
  },
});
