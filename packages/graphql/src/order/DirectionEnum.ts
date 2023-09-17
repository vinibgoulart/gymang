import { graphqlEnumBuilder } from '../graphqlEnumBuilder';

export type DIRECTION = 1 | -1;

export const DIRECTION = {
  ASC: 1,
  DESC: -1,
};

export const DirectionEnum = graphqlEnumBuilder('DirectionEnum', DIRECTION);
