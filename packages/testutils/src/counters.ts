export const getCounter = (key: string) => {
  if (key in global.__COUNTERS__) {
    const currentValue = global.__COUNTERS__[key];

    global.__COUNTERS__[key]++;

    return currentValue;
  }

  global.__COUNTERS__[key] = 1;
  return 0;
};

export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce(
    (prev, curr) => ({ ...prev, [curr]: 0 }),
    {},
  );
};
