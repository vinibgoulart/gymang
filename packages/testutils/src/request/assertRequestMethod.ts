import type { MockRequest } from './assertRequestUrl';

export const assertRequestMethod = (
  mockRequest: MockRequest,
  method: string,
) => {
  const [, requestInit] = mockRequest;

  expect(requestInit.method).toBe(method);
};
