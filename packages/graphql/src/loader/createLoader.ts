/* eslint max-classes-per-file: 0 */

import DataLoader from 'dataloader';
import type { ConnectionArguments } from 'graphql-relay';
import type { Model } from 'mongoose';

import type { DataLoaderKey } from '@gymang/types';

import { mongooseLoader } from './MongooseLoader';
import { debugConsole } from '../debug/debugConsole';
import { buildMongoConditionsFromFilters } from '../filters/buildMongoConditionsFromFilters';
import type { FilterMapping } from '../filters/filterType';
import { withAggregate } from '../withAggregate';
import { withAggregateCursor } from '../withAggregateCursor';
import { withConnectionAggregate } from '../withConnectionAggregate';
import { withFilter } from '../withFilter';

type CreateLoaderArgs<Context, T> = {
  model: Model<any>;
  viewerCanSee?: (context: Context, data: T) => Promise<T | null>;
  viewerCanSeeConnection?: (context: Context) => boolean;
  loaderName: string;
  filterMapping?: FilterMapping<Context, any>;
  defaultArgs?: Record<string, unknown>;
  withRemovedAt?: boolean;
  __typename?: string;
  debug?: boolean;
};
export const createLoader = <Context extends Record<string, unknown>, T>({
  model,
  viewerCanSee,
  viewerCanSeeConnection,
  loaderName,
  filterMapping = {},
  defaultArgs = {},
  withRemovedAt = true,
  __typename,
  debug = false,
}: CreateLoaderArgs<Context, T>) => {
  class Loader {
    constructor(data: any) {
      // eslint-disable-next-line
      Object.keys(data).map((key) => {
        this[key] = data[key];
      });
      this.id = data.id || data._id;
      this._id = data.id || data._id;
      this.__typename = __typename ?? model.collection.collectionName;
    }
  }

  const nameIt = (name: string, cls) =>
    ({ [name]: class extends cls {} }[name]);

  const Wrapper = nameIt(__typename ?? model.collection.collectionName, Loader);

  const getLoader = () => new DataLoader((ids) => mongooseLoader(model, ids));

  const load = async (
    context: Context,
    id: DataLoaderKey,
    bypassViewerCanSee = false,
  ) => {
    if (!id) {
      return null;
    }

    try {
      const data = await context.dataloaders[loaderName].load(id.toString());

      if (!data) {
        return null;
      }

      if (!viewerCanSee || bypassViewerCanSee) {
        return data ? new Wrapper(data) : null;
      }

      const filteredData = await viewerCanSee(context, data);

      return filteredData ? new Wrapper(filteredData) : null;
    } catch (err) {
      // eslint-disable-next-line
      console.log('loader load err', err);

      return null;
    }
  };

  const clearCache = ({ dataloaders }: Context, id: string) =>
    dataloaders[loaderName].clear(id.toString());

  const getPipeline = (context: Context, args: ConnectionArguments) => {
    const removedAtMatch = withRemovedAt
      ? {
          removedAt: null,
        }
      : {};

    if (!filterMapping) {
      return [
        {
          $match: {
            ...removedAtMatch,
          },
        },
      ];
    }

    const argsWithDefaults = withFilter(args, defaultArgs);

    const builtMongoConditions = buildMongoConditionsFromFilters(
      context,
      argsWithDefaults.filters,
      filterMapping,
    );

    const pipeline = [
      {
        $match: {
          ...removedAtMatch,
          ...builtMongoConditions.conditions,
        },
      },
      ...builtMongoConditions.pipeline,
    ];

    if (debug) {
      // eslint-disable-next-line
      debugConsole(pipeline);
    }

    return pipeline;
  };

  const loadAll = withConnectionAggregate(
    model,
    load,
    getPipeline,
    viewerCanSeeConnection,
  );

  const loadAllCursor = withAggregateCursor(model, getPipeline);

  // TODO - deprecate this and use loadAllCursor
  const loadAllAggregate = withAggregate(model, getPipeline);

  return {
    Wrapper,
    getLoader,
    clearCache,
    load,
    loadAll,
    getPipeline,
    loadAllCursor,
    loadAllAggregate,
  };
};
