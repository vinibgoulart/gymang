import { DIRECTION } from './DirectionEnum';

export const handleOrderBy = (
  sortMapper: Record<string, unknown>,
  orderBy: Record<string, unknown> | object[],
) => {
  if (!orderBy) {
    return [];
  }

  if (Array.isArray(orderBy)) {
    return orderBy.map((o) => handleOrderBy(o));
  }

  if (!orderBy.sort && !orderBy.direction) {
    return [];
  }

  if (!(orderBy.sort in sortMapper)) {
    return [];
  }

  return [
    {
      direction:
        orderBy.direction in DIRECTION
          ? DIRECTION[orderBy.direction]
          : DIRECTION.ASC,
      sort: sortMapper[orderBy.sort],
    },
  ];
};
