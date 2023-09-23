export const consoleByValue = (...args) => {
  const stable = args.map((arg) => {
    if (Array.isArray(arg)) {
      return [...arg];
    }

    if (typeof arg === 'object') {
      return JSON.parse(JSON.stringify(arg));
    }

    return arg;
  });

  // eslint-disable-next-line
  console.log(...stable);
};
