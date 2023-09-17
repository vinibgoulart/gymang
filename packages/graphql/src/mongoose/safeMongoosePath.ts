import dot from 'dot-object';

export const safeMongoosePath = (args: Record<string, unknown>) =>
  dot.dot(args);
