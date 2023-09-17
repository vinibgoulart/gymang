import {
  arrayOperators,
  validOperators,
} from './buildMongoConditionsFromFilters';
import type { FilterFieldMapping } from './filterType';

export const handleFieldOperator = <TContext>(
  context: TContext,
  condition: Record<string, unknown>,
  conditionName: string,
  fieldMapping: FilterFieldMapping<TContext, any>,
  prev: Record<string, unknown>,
  filters: Record<string, unknown>,
) => {
  // { "myField_operator": "something" } becomes { "myField": { $operator: "something" } }
  // { "myField": "something" } remains the same
  const conditionNamePieces = conditionName.split('_');
  const operator =
    conditionNamePieces.length > 1 ? conditionNamePieces.pop() : '';
  // I don't think we support snake case for field names, should this be here?
  // eslint-disable-next-line
  conditionName = conditionNamePieces.join('_');

  if (
    fieldMapping &&
    fieldMapping.format &&
    typeof fieldMapping.format === 'function'
  ) {
    condition = fieldMapping.format(condition, filters, context); // eslint-disable-line
  }

  if (operator) {
    if (validOperators.indexOf(operator) === -1) {
      throw new Error(
        `"${operator}" is not a valid operator on field "${conditionName}".`,
      );
    }

    if (arrayOperators.indexOf(operator) >= 0 && !Array.isArray(condition)) {
      throw new Error(`Field "${conditionName}" must have an array value.`);
    }

    // eslint-disable-next-line
    condition = {
      [`$${operator}`]: condition,
    };
  }

  // handle $gte and $let fields merge
  if (conditionName in prev) {
    if (prev[conditionName] && typeof prev[conditionName] !== 'object') {
      return {
        condition,
        conditionName,
      };
    }

    if (typeof condition !== 'object') {
      return {
        condition,
        conditionName,
      };
    }

    if (`$${operator}` in prev[conditionName]) {
      return {
        condition,
        conditionName,
      };
    }

    // eslint-disable-next-line
    condition = {
      ...condition,
      ...prev[conditionName],
    };
  }

  return {
    condition,
    conditionName,
  };
};
