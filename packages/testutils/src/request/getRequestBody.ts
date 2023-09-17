import type { MockRequest } from './assertRequestUrl';

export const getRequestBody = (mockRequest: MockRequest) => {
  const [, requestInit] = mockRequest;

  return JSON.parse(requestInit.body);
};
