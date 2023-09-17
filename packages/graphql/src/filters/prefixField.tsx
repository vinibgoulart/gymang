export const prefixField = (prefix: string | null = null) => (field: string) => {
  if (!prefix) {
    return field;
  }

  return `${prefix}.${field}`;
};
