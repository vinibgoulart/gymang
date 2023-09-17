import { FILTER_CONDITION_TYPE } from './filters/filterType';
import { getObjectId } from './getObjectId';

export const getFieldsOneToOne = (fields: string[], objectId = false) => {
  const formatParam = objectId
    ? { format: (value?: string) => value && getObjectId(value) }
    : {};

  return fields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: {
        type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
        key: field,
        ...formatParam,
      },
    }),
    {},
  );
};
