import { buildConditionsObject } from './buildConditionsObject';
import type { BuildedConditionSet, FilterFieldMapping } from './filterType';
import { FILTER_CONDITION_TYPE } from './filterType';
import { getFilterName } from './getFilterName';

export const validOperators = [
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'ne',
  'all',
  'not',
];

export const arrayOperators = ['in', 'nin', 'all'];

export type Operators =
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'ne'
  | 'all'
  | '$and'
  | '$or';

export function buildMongoConditionsFromFilters<TContext = any, TValue = any>(
  context: TContext,
  filters: Record<string, unknown>,
  mapping: { [key: string]: FilterFieldMapping<TContext, TValue> } = {},
): BuildedConditionSet {
  if (!filters) {
    return { conditions: {}, pipeline: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const keys = Object.keys(filters);

  // first check if there are any pipeline mapped fields
  //  and if AND or OR are also passed, if that is the case, we must throw an error
  //  because we cannot use OR/AND while also using pipeline.

  // @TODO: Commenting it to be able to run OR filters with orderBy pipeline filtering
  // const hasPipelineFilter = keys.find(
  //   (item) => mapping[item]?.type === FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
  // );

  // if (hasPipelineFilter && (filters.AND || filters.OR)) {
  //   throw new Error(
  //     `Wrong filter usage, because filter "${hasPipelineFilter}" is a pipeline filter, which should disable AND and OR`,
  //   );
  // }

  // separate filters by type
  const filtersKeysGrouped = Object.keys(filters).reduce(
    (prev, key) => {
      const filterName = getFilterName(key);

      // $FlowExpectedError `type` missing on Boolean, but the only allowed boolean is false
      const type =
        (mapping && mapping[filterName]?.type) ||
        FILTER_CONDITION_TYPE.MATCH_1_TO_1;

      return {
        ...prev,
        [type]: {
          ...prev[type],
          // $FlowExpectedError filters can never be null, see check at top of function
          [key]: filters[key],
        },
      };
    },
    {
      // start with sane defaults
      [FILTER_CONDITION_TYPE.MATCH_1_TO_1]: {},
      [FILTER_CONDITION_TYPE.CUSTOM_CONDITION]: {},
      [FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE]: {},
    },
  );

  // first build our conditions object.
  const conditions = buildConditionsObject(
    context,
    {
      ...filtersKeysGrouped.MATCH_1_TO_1,
      ...filtersKeysGrouped.CUSTOM_CONDITION,
    },
    mapping,
    filters,
  );

  // now build the pipeline, which is more straightforward
  const pipeline = Object.keys(filtersKeysGrouped.AGGREGATE_PIPELINE).reduce(
    (prev, key) => {
      const mappedFilter = mapping[key];

      // should not really happen!
      if (
        !mappedFilter ||
        mappedFilter.type !== FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE
      ) {
        return prev;
      }

      const fieldPipeline = Array.isArray(mappedFilter.pipeline)
        ? mappedFilter.pipeline
        : // $FlowExpectedError filters can never be null, see check at top of function
          mappedFilter.pipeline(filters[key], filters, context);

      return [...prev, ...(Array.isArray(fieldPipeline) ? fieldPipeline : [])];
    },
    [],
  );

  return {
    conditions,
    pipeline,
  };
}
