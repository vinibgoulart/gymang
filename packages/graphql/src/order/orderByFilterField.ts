import { FILTER_CONDITION_TYPE } from '../filters/filterType';
import { buildSortFromOrderByArg } from './buildSortFromOrderByArg';

export const orderByFilterField = {
  orderBy: {
    type: FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
    pipeline: (value) => [
      {
        $sort: buildSortFromOrderByArg(value),
      },
    ],
  },
};
