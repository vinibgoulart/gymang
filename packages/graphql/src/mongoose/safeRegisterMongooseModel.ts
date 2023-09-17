import mongoose, { Schema } from 'mongoose';

export const safeRegisterMongooseModel = (
  modelName: string,
  schema: Schema,
) => {
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  return mongoose.model(modelName, schema);
};
