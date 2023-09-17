import type { MockRequest } from './assertRequestUrl';

export const getRequestMethod = (mockRequest: MockRequest) => {
  const [, requestInit] = mockRequest;

  return requestInit.method;
};
