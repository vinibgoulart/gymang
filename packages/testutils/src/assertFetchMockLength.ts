export const assertFetchMockLength = (length: number) => {
  try {
    const fetchMock = require('jest-fetch-mock');

    expect(fetchMock.mock.calls.length).toBe(length);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertFetchMockLength);

    throw error;
  }
};
