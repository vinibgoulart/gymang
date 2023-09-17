export const assertArrayMongoose = (
  arr1: Array<string>,
  arr2: Array<string>,
) => {
  expect(arr1.map((o) => o.toString())).toEqual(arr2.map((o) => o.toString()));
};
