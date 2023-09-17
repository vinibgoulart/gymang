import { fromGlobalId } from 'graphql-relay';
import { Model, Types } from 'mongoose';

// returns an ObjectId given an param of unknown type
export const getObjectId = (
  target?: string | Model<any> | Types.ObjectId | null,
): Types.ObjectId | null => {
  if (!target) return null;

  if (target instanceof Types.ObjectId) {
    return new Types.ObjectId(target.toString());
  }

  if (typeof target === 'object') {
    if (target && target.id && Types.ObjectId.isValid(target.id)) {
      return new Types.ObjectId(target.id);
    }

    return target && target._id ? new Types.ObjectId(target._id) : null;
  }

  if (Types.ObjectId.isValid(target)) {
    return new Types.ObjectId(target.toString());
  }

  if (typeof target === 'string') {
    const result = fromGlobalId(target);

    if (result.type && result.id && Types.ObjectId.isValid(result.id)) {
      try {
        return new Types.ObjectId(result.id);
      } catch (err) {
        // weird { result: { type: '�]�{o', id: '����n�m�4�M4' }, isValid: true }
        // eslint-disable-next-line
        console.log('weird result id', err, result);
        return null;
      }
    }

    if (Types.ObjectId.isValid(target)) {
      return new Types.ObjectId(target);
    }

    return null;
  }

  return null;
};
