import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import type { MutationFn } from 'graphql-relay/mutation/mutation';
import type { Model } from 'mongoose';

import { errorField, successField } from '..';
import { getObjectId } from '../getObjectId';

type MutationArgs = {
  id: string;
};

type CreateRemoveArgs<Context> = {
  name: string;
  model: Model<any>;
  validate?: (context: Context, item: any) => string | null;
  clearCache: (context: Context, id: string) => void;
  notFoundMessage: (context: Context) => string;
  successMessage: (context: Context) => string;
  mutateAndGetPayload?: MutationFn;
};
export const createRemoveMutation = <Context extends Record<string, unknown>>({
  name,
  model,
  validate,
  clearCache,
  notFoundMessage,
  successMessage,
  mutateAndGetPayload,
}: CreateRemoveArgs<Context>) => {
  const mutation = mutationWithClientMutationId({
    name,
    inputFields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    mutateAndGetPayload: async (args: MutationArgs, context: Context, info) => {
      const item = await model.findOne({
        _id: getObjectId(args.id),
        removedAt: null,
      });

      if (!item) {
        return {
          error: notFoundMessage
            ? notFoundMessage(context)
            : context.t('Item not found'),
        };
      }

      if (validate) {
        const error = await validate(context, item);

        if (typeof error === 'string') {
          return { error };
        }
      }

      const date = new Date();

      const itemRemoved = await model.findOneAndUpdate(
        { _id: item._id },
        { removedAt: date },
        { new: true },
      );

      if (mutateAndGetPayload) {
        await mutateAndGetPayload(args, context, info);
      }

      clearCache(context, itemRemoved._id);

      return {
        id: itemRemoved._id,
        error: null,
        success: successMessage
          ? successMessage(context)
          : context.t('Successfully removed'),
      };
    },
    outputFields: {
      deletedID: {
        type: GraphQLID,
        resolve: async ({ id }) => {
          if (!id) {
            return null;
          }

          return toGlobalId(model.modelName, id);
        },
      },
      ...errorField,
      ...successField,
    },
  });

  return mutation;
};
