import type { GraphQLNullableType } from 'graphql';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import type { Model } from 'mongoose';

import { errorField } from '../fields/errorField';
import { successField } from '../fields/successField';
import { getObjectId } from '../getObjectId';

type MutationArgs = {
  id: string;
};

type CreateEditSingleFieldArgs<Context> = {
  name: string;
  model: Model<any>;
  clearCache: (context: Context, id: string) => void;
  notFoundMessage: (context: Context) => string;
  successMessage: (context: Context) => string;
  fieldName: string;
  fieldType: GraphQLNullableType;
  outputFields: Record<string, unknown>;
  process: (
    args: MutationArgs,
    context: Context,
    item: Model<any>,
  ) => Promise<void>;
  acceptNullField: boolean;
};
export const createEditSingleFieldMutation = <Context extends object>({
  name,
  model,
  clearCache,
  notFoundMessage,
  successMessage,
  fieldName,
  fieldType,
  outputFields,
  process,
  acceptNullField = false,
}: CreateEditSingleFieldArgs<Context>) => {
  const mutation = mutationWithClientMutationId({
    name,
    inputFields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      [fieldName]: {
        type: acceptNullField ? fieldType : new GraphQLNonNull(fieldType),
      },
    },
    mutateAndGetPayload: async (args: MutationArgs, context: Context) => {
      const item = await model.findOne({
        _id: getObjectId(args.id),
      });

      if (!item) {
        return {
          error: notFoundMessage
            ? notFoundMessage(context)
            : context.t('Item not found'),
        };
      }

      await model.findOneAndUpdate(
        {
          _id: item._id,
        },
        {
          $set: {
            [fieldName]: args[fieldName],
          },
        },
      );

      clearCache(context, item._id);

      if (process) {
        await process(args, context, item);
      }

      return {
        id: item._id,
        error: null,
        success: successMessage
          ? successMessage(context)
          : context.t('Successfully edited'),
      };
    },
    outputFields: {
      ...errorField,
      ...successField,
      ...outputFields,
    },
  });

  return mutation;
};
