import type { WriteConcern } from 'mongoose';

const j = process.env.NODE_ENV === 'production';

export const writeConcern: WriteConcern = {
  w: 'majority',
  j,
  wtimeout: 10000,
};
