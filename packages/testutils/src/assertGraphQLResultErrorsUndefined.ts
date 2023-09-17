import { debugConsole } from '@gymang/graphql';

export const assertGraphQLResultErrorsUndefined = (result) => {
  if (result.errors) {
    // eslint-disable-next-line
    debugConsole(result);
  }

  try {
    expect(result.errors).toBeUndefined();
  } catch (error) {
    Error.captureStackTrace(error as Error, assertGraphQLResultErrorsUndefined);

    throw error;
  }
};
