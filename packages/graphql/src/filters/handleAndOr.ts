import { buildConditionsObject } from './buildConditionsObject';
import type { Operators } from './buildMongoConditionsFromFilters';
import type { FilterFieldMapping } from './filterType';

export const handleAndOr =
  <TContext>(operator: Operators) =>
  (
    context: TContext,
    condition: any[],
    mapping: { [key: string]: FilterFieldMapping<TContext, any> },
  ) => {
    if (!Array.isArray(condition)) {
      throw new Error(`Invalid filter supplied to ${operator}.`);
    }

    return {
      condition: condition.map((andCondition) =>
        buildConditionsObject(context, andCondition, mapping),
      ),
      conditionName: operator,
    };
  };

export const handleAnd = handleAndOr('$and');
export const handleOr = handleAndOr('$or');
