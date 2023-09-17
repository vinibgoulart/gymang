type AssertRequestArgs = {
  url: string;
  body?: Record<string | number, unknown>;
};

export const assertRequest = (
  request: [string | Request | undefined, RequestInit | undefined],
  { url, body = {} }: AssertRequestArgs,
) => {
  const [requestUrl, requestOptions] = request;

  try {
    expect(requestUrl).toBe(url);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertRequest);

    throw error;
  }

  if (!requestOptions?.body) {
    return;
  }

  try {
    expect(JSON.parse(requestOptions?.body as string)).toEqual(body);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertRequest);

    throw error;
  }
};
