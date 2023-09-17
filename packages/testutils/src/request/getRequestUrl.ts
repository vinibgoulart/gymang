export type MockRequest = [string, RequestInit];

export const getRequestUrl = (mockRequest: MockRequest) => {
  const [requestUrl] = mockRequest;

  return requestUrl;
};
