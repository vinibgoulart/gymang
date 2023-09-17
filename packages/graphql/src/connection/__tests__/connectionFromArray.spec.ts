import { connectionFromArray } from '../connectionFromArray';

// based on https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js
describe('connectionFromArray()', () => {
  const letters = ['A', 'B', 'C', 'D', 'E'];

  describe('basic slicing', () => {
    it('returns all elements without filters', () => {
      const c = connectionFromArray({ data: letters, args: {} });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },

        startCursorOffset: 0,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('respects a smaller first', () => {
      const c = connectionFromArray({ data: letters, args: { first: 2 } });
      return expect(c).toEqual({
        edges: [
          { node: 'A', cursor: 'YXJyYXljb25uZWN0aW9uOjA=' },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          hasPreviousPage: false,
          hasNextPage: true,
        },
        startCursorOffset: 0,
        endCursorOffset: 2,
        count: 5,
      });
    });

    it('respects an overly large first', () => {
      const c = connectionFromArray({ data: letters, args: { first: 10 } });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('respects a smaller last', () => {
      const c = connectionFromArray({ data: letters, args: { last: 2 } });
      return expect(c).toEqual({
        edges: [
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: true,
          hasNextPage: false,
        },
        startCursorOffset: 3,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('respects an overly large last', () => {
      const c = connectionFromArray({ data: letters, args: { last: 10 } });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 5,
        count: 5,
      });
    });
  });

  describe('pagination', () => {
    it('respects first and after', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          first: 2,
          after: 'YXJyYXljb25uZWN0aW9uOjE=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: false,
          hasNextPage: true,
        },
        startCursorOffset: 2,
        endCursorOffset: 4,
        count: 5,
      });
    });

    it('respects first and after with long first', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          first: 10,
          after: 'YXJyYXljb25uZWN0aW9uOjE=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 2,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('respects last and before', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          last: 2,
          before: 'YXJyYXljb25uZWN0aW9uOjM=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          hasPreviousPage: true,
          hasNextPage: false,
        },
        startCursorOffset: 1,
        endCursorOffset: 3,
        count: 5,
      });
    });

    it('respects last and before with long last', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          last: 10,
          before: 'YXJyYXljb25uZWN0aW9uOjM=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 3,
        count: 5,
      });
    });

    it('respects first and after and before, too few', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          first: 2,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          hasPreviousPage: false,
          hasNextPage: true,
        },
        startCursorOffset: 1,
        endCursorOffset: 3,
        count: 5,
      });
    });

    it('respects first and after and before, too many', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          first: 4,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 1,
        endCursorOffset: 4,
        count: 5,
      });
    });

    it('respects first and after and before, exactly right', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          first: 3,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 1,
        endCursorOffset: 4,
        count: 5,
      });
    });

    it('respects last and after and before, too few', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          last: 2,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: true,
          hasNextPage: false,
        },
        startCursorOffset: 2,
        endCursorOffset: 4,
        count: 5,
      });
    });

    it('respects last and after and before, too many', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          last: 4,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 1,
        endCursorOffset: 4,
        count: 5,
      });
    });

    it('respects last and after and before, exactly right', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          last: 3,
          after: 'YXJyYXljb25uZWN0aW9uOjA=',
          before: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 1,
        endCursorOffset: 4,
        count: 5,
      });
    });
  });

  describe('cursor edge cases', () => {
    // TODO - fix this
    // it('throws an error if first < 0', () => {
    //   expect(() => {
    //     connectionFromArray({ data: letters, args: { first: -1 } });
    //   }).to.throw('Argument "first" must be a non-negative integer');
    // });
    //
    // it('throws an error if last < 0', () => {
    //   expect(() => {
    //     connectionFromArray({ data: letters, args: { last: -1 } });
    //   }).to.throw('Argument "last" must be a non-negative integer');
    // });

    it('returns all elements if cursors are invalid', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          before: 'invalid',
          after: 'invalid',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('returns all elements if cursors are on the outside', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          before: 'YXJyYXljb25uZWN0aW9uOjYK',
          after: 'YXJyYXljb25uZWN0aW9uOi0xCg==',
        },
      });
      return expect(c).toEqual({
        edges: [
          {
            node: 'A',
            cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
          {
            node: 'B',
            cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
          },
          {
            node: 'C',
            cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
          },
          {
            node: 'D',
            cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
          },
          {
            node: 'E',
            cursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          },
        ],
        pageInfo: {
          startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 5,
        count: 5,
      });
    });

    it('returns no elements if cursors cross', () => {
      const c = connectionFromArray({
        data: letters,
        args: {
          before: 'YXJyYXljb25uZWN0aW9uOjI=',
          after: 'YXJyYXljb25uZWN0aW9uOjQ=',
        },
      });
      return expect(c).toEqual({
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: false,
        },
        startCursorOffset: 0,
        endCursorOffset: 1,
        count: 5,
      });
    });
  });
});

it('returns all correct with only 1 item', () => {
  const letters = ['A'];

  const c = connectionFromArray({ data: letters, args: {} });
  return expect(c).toEqual({
    edges: [
      {
        node: 'A',
        cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
      },
    ],
    pageInfo: {
      startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
      endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
      hasPreviousPage: false,
      hasNextPage: false,
    },
    startCursorOffset: 0,
    endCursorOffset: 1,
    count: 1,
  });
});
