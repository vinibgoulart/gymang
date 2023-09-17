import { handleOrderBy } from '../handleOrderBy';

it('should properly convert orderBy from export', () => {
  const orderBy = { direction: 'DESC', sort: 'CREATED_AT' };

  const FeedbackSort = {
    SCORE: 'score',
    CREATED_AT: 'createdAt',
  };

  const orderByHandled = handleOrderBy(FeedbackSort, orderBy);

  expect(orderByHandled).toEqual([
    {
      direction: -1,
      sort: 'createdAt',
    },
  ]);
});
