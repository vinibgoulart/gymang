export const spreadJsonToImport = (
  array: any[],
  columns: { [key: string]: string },
) => {
  const result = [];
  for (const item of array) {
    result.push(
      Object.keys(columns).reduce(
        (acc, curr) => ({ ...acc, [columns[curr]]: item[curr] }),
        {},
      ),
    );
  }
  return result;
};
