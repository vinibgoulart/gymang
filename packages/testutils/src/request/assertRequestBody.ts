import type { MockRequest } from './assertRequestUrl';

export const assertRequestBody = (
  mockRequest: MockRequest,
  body: Record<string, unknown>,
) => {
  const [, requestInit] = mockRequest;

  expect(JSON.parse(requestInit.body)).toEqual(body);
};
