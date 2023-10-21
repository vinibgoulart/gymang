import { isLoggedIn, type GraphQLContext } from '@gymang/core';
import {
  nodeInterface,
  createdAtField,
  NullConnection,
  connectionFromArray,
} from '@gymang/graphql';
import type { IRecord } from '@gymang/workout-split';
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { exercisesConnectionField } from '../../exercise/ExerciseFields';

const RecordType = new GraphQLObjectType<IRecord, GraphQLContext>({
  name: 'Record',
  description: 'Represents a Record',
  fields: () => ({
    id: globalIdField('Record', (obj) => obj.id || obj._id),
    ...exercisesConnectionField((obj, args, context) => {
      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      console.log({ obj });

      return connectionFromArray({
        data: obj.exercises,
        args,
      });
    }),
    ...createdAtField,
    finishedAt: {
      type: GraphQLString,
      resolve: (record) =>
        record.finishedAt ? record.finishedAt.toISOString() : null,
    },
  }),
  interfaces: () => [nodeInterface],
});

export const RecordConnection = connectionDefinitions({
  name: 'Record',
  nodeType: RecordType,
});

export default RecordType;
