import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

// transform all ObjectId to string
export const mongooseObjectIdToString = (data: any) => {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((d) => mongooseObjectIdToString(d));
  }

  if (ObjectId.isValid(data) && data.toString().indexOf(data) !== -1) {
    return data.toString();
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.keys(data).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: mongooseObjectIdToString(data[curr]),
      }),
      {},
    );
  }

  return data;
};
