import type { FilterFieldMapping } from './filterType';
import { FILTER_CONDITION_TYPE } from './filterType';
import { getFilterName } from './getFilterName';
import { handleAnd, handleOr } from './handleAndOr';
import { handleFieldOperator } from './handleFieldOperator';

export function buildConditionsObject<TContext, TValue>(
  context: TContext,
  conditions: Record<string, unknown>,
  mapping: { [key: string]: FilterFieldMapping<TContext, TValue> },
  filters?: Record<string, unknown>,
) {
  return Object.keys(conditions).reduce((prev, currentKey) => {
    let condition = conditions[currentKey];
    let conditionName = currentKey;

    const fieldMapping = mapping[getFilterName(currentKey)];

    if (fieldMapping === false) {
      return prev;
    }

    if (
      fieldMapping &&
      fieldMapping.type !== FILTER_CONDITION_TYPE.MATCH_1_TO_1 &&
      fieldMapping.type !== FILTER_CONDITION_TYPE.CUSTOM_CONDITION
    ) {
      return prev;
    }

    if (conditionName === 'AND') {
      ({ condition, conditionName } = handleAnd(context, condition, mapping));
    } else if (conditionName === 'OR') {
      ({ condition, conditionName } = handleOr(context, condition, mapping));
    } else {
      if (
        fieldMapping &&
        fieldMapping.type === FILTER_CONDITION_TYPE.CUSTOM_CONDITION
      ) {
        if (fieldMapping.format && typeof fieldMapping.format === 'function') {
          const conditionNamePieces = conditionName.split('_');
          const operator = conditionNamePieces[1];

          const customCondition = fieldMapping.format(
            condition,
            filters,
            context,
            operator,
          );

          return {
            ...prev,
            ...customCondition,
          };
        }
      }

      ({ condition, conditionName } = handleFieldOperator(
        context,
        condition,
        conditionName,
        fieldMapping,
        prev,
        filters,
      ));
    }

    conditionName =
      fieldMapping && fieldMapping.key ? fieldMapping.key : conditionName;

    if (condition === undefined) {
      return prev;
    }

    return {
      ...prev,
      [conditionName]: condition,
    };
  }, {});
}
