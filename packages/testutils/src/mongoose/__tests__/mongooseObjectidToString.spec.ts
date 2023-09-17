import mongoose from 'mongoose';

import { mongooseObjectIdToString } from '../mongooseObjectIdToString';

const { ObjectId } = mongoose.Types;

it('should convert objectid to string, nested and array', () => {
  const obj = {
    _id: new ObjectId('5c9b1b9b9b9b9b9b9b9b9b9b'),
    name: 'test',
    myarr: [
      new ObjectId('5c9b1b9b9b9b9b9b9b9b9b9b'),
      new ObjectId('5c9b1b9b9b9b9b9b9b9b9b9b'),
      new ObjectId('5c9b1b9b9b9b9b9b9b9b9b9b'),
    ],
    my: {
      nested: {
        field: new ObjectId('5c9b1b9b9b9b9b9b9b9b9b9b'),
      },
    },
  };

  expect(mongooseObjectIdToString(obj)).toEqual({
    _id: '5c9b1b9b9b9b9b9b9b9b9b9b',
    name: 'test',
    myarr: [
      '5c9b1b9b9b9b9b9b9b9b9b9b',
      '5c9b1b9b9b9b9b9b9b9b9b9b',
      '5c9b1b9b9b9b9b9b9b9b9b9b',
    ],
    my: {
      nested: {
        field: '5c9b1b9b9b9b9b9b9b9b9b9b',
      },
    },
  });
});
