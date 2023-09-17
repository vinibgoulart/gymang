export const assertResponseStatus = (response, statusCode: number) => {
  if (response.status !== statusCode) {
    // eslint-disable-next-line
    console.log(response.body);
  }

  try {
    expect(response.status).toBe(statusCode);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertResponseStatus);

    throw error;
  }
};
