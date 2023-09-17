import dot from 'dot-object';
import type { Document } from 'mongoose';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[] // eslint-disable-next-line
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};

export const safeNestedPath = <D extends Document>(args: DeepPartial<D>) =>
  dot.dot(args);

/*
Usage
const updatedPayload = safeNestPath({
  nested: {
    downThere: {
      name: 'awesome',
    }
  }
})

// same as: $set: 'nested.downThere.name': 'awesome'
await MyModel.findOneAndUpdate({_id }, { $set: updatePayload })

 */
