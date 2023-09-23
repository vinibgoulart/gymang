const excludeKeys = ['__fragments', '__id', '__fragmentOwner'];

// strip __fragments, __id, __fragmentOwne
export const relayTransform = (key: string, value: string) => {
  if (excludeKeys.includes(key)) {
    return undefined;
  }

  return value;
};

export const debugRelay = (value: any) => {
  // eslint-disable-next-line
  console.log(JSON.parse(JSON.stringify(value, relayTransform)));
};
