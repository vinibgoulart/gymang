import type { MetricsCreateArgs } from './metricsCreate';

type ValidateMetricsCreateArgs = {} & MetricsCreateArgs;

export const validateMetricsCreate = async ({
  payload,
  context,
}: ValidateMetricsCreateArgs) => {
  const { t } = context;
  const { age, height, weight, fat } = payload;

  const defaultErrorObject = {
    age: null,
    height: null,
    weight: null,
    fat: null,
  };

  if (!age) {
    return {
      ...defaultErrorObject,
      error: t('Age is required'),
    };
  }

  if (!height) {
    return {
      ...defaultErrorObject,
      error: t('Height is required'),
    };
  }

  if (!weight) {
    return {
      ...defaultErrorObject,
      error: t('Weight is required'),
    };
  }

  if (!isNaN(age) && age < 0) {
    return {
      ...defaultErrorObject,
      error: t('Age must be a positive number'),
    };
  }

  if (!isNaN(height) && height < 0) {
    return {
      ...defaultErrorObject,
      error: t('Height must be a positive number'),
    };
  }

  if (!isNaN(weight) && weight < 0) {
    return {
      ...defaultErrorObject,
      error: t('Weight must be a positive number'),
    };
  }

  return {
    age,
    height,
    weight,
    fat,
    error: null,
  };
};
