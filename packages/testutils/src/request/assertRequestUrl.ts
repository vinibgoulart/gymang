export type MockRequest = [string, RequestInit];

export const assertRequestUrl = (mockRequest: MockRequest, url: string) => {
  const [requestUrl] = mockRequest;

  expect(requestUrl).toBe(url);
};
