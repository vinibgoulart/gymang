export const existsOrNull = (key: string) => [
  {
    [key]: {
      $exists: false,
    },
  },
  {
    [key]: null,
  },
];
