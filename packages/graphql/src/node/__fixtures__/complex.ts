export const complexInfo = {
  fieldNodes: [
    {
      kind: 'Field',
      alias: { kind: 'Name', value: 'qrcode', loc: { start: 424, end: 430 } },
      name: { kind: 'Name', value: 'node', loc: { start: 432, end: 436 } },
      arguments: [
        {
          kind: 'Argument',
          name: { kind: 'Name', value: 'id', loc: { start: 437, end: 439 } },
          value: {
            kind: 'Variable',
            name: {
              kind: 'Name',
              value: 'id',
              loc: { start: 442, end: 444 },
            },
            loc: { start: 441, end: 444 },
          },
          loc: { start: 437, end: 444 },
        },
      ],
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: undefined,
            name: {
              kind: 'Name',
              value: '__typename',
              loc: { start: 452, end: 462 },
            },
            arguments: [],
            directives: [],
            selectionSet: undefined,
            loc: { start: 452, end: 462 },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'QrCodeAdmin',
                loc: { start: 474, end: 485 },
              },
              loc: { start: 474, end: 485 },
            },
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  alias: undefined,
                  name: {
                    kind: 'Name',
                    value: 'id',
                    loc: { start: 494, end: 496 },
                  },
                  arguments: [],
                  directives: [],
                  selectionSet: undefined,
                  loc: { start: 494, end: 496 },
                },
                {
                  kind: 'Field',
                  alias: undefined,
                  name: {
                    kind: 'Name',
                    value: 'answers',
                    loc: { start: 503, end: 510 },
                  },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: {
                        kind: 'Name',
                        value: 'first',
                        loc: { start: 511, end: 516 },
                      },
                      value: {
                        kind: 'Variable',
                        name: {
                          kind: 'Name',
                          value: 'first',
                          loc: { start: 519, end: 524 },
                        },
                        loc: { start: 518, end: 524 },
                      },
                      loc: { start: 511, end: 524 },
                    },
                    {
                      kind: 'Argument',
                      name: {
                        kind: 'Name',
                        value: 'last',
                        loc: { start: 526, end: 530 },
                      },
                      value: {
                        kind: 'Variable',
                        name: {
                          kind: 'Name',
                          value: 'last',
                          loc: { start: 533, end: 537 },
                        },
                        loc: { start: 532, end: 537 },
                      },
                      loc: { start: 526, end: 537 },
                    },
                    {
                      kind: 'Argument',
                      name: {
                        kind: 'Name',
                        value: 'before',
                        loc: { start: 539, end: 545 },
                      },
                      value: {
                        kind: 'Variable',
                        name: {
                          kind: 'Name',
                          value: 'before',
                          loc: { start: 548, end: 554 },
                        },
                        loc: { start: 547, end: 554 },
                      },
                      loc: { start: 539, end: 554 },
                    },
                    {
                      kind: 'Argument',
                      name: {
                        kind: 'Name',
                        value: 'after',
                        loc: { start: 556, end: 561 },
                      },
                      value: {
                        kind: 'Variable',
                        name: {
                          kind: 'Name',
                          value: 'after',
                          loc: { start: 564, end: 569 },
                        },
                        loc: { start: 563, end: 569 },
                      },
                      loc: { start: 556, end: 569 },
                    },
                    {
                      kind: 'Argument',
                      name: {
                        kind: 'Name',
                        value: 'filters',
                        loc: { start: 571, end: 578 },
                      },
                      value: {
                        kind: 'Variable',
                        name: {
                          kind: 'Name',
                          value: 'filters',
                          loc: { start: 581, end: 588 },
                        },
                        loc: { start: 580, end: 588 },
                      },
                      loc: { start: 571, end: 588 },
                    },
                  ],
                  directives: [],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        alias: undefined,
                        name: {
                          kind: 'Name',
                          value: 'endCursorOffset',
                          loc: { start: 600, end: 615 },
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: undefined,
                        loc: { start: 600, end: 615 },
                      },
                      {
                        kind: 'Field',
                        alias: undefined,
                        name: {
                          kind: 'Name',
                          value: 'startCursorOffset',
                          loc: { start: 624, end: 641 },
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: undefined,
                        loc: { start: 624, end: 641 },
                      },
                      {
                        kind: 'Field',
                        alias: undefined,
                        name: {
                          kind: 'Name',
                          value: 'count',
                          loc: { start: 650, end: 655 },
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: undefined,
                        loc: { start: 650, end: 655 },
                      },
                      {
                        kind: 'Field',
                        alias: undefined,
                        name: {
                          kind: 'Name',
                          value: 'pageInfo',
                          loc: { start: 664, end: 672 },
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'hasNextPage',
                                loc: { start: 685, end: 696 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: undefined,
                              loc: { start: 685, end: 696 },
                            },
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'hasPreviousPage',
                                loc: { start: 707, end: 722 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: undefined,
                              loc: { start: 707, end: 722 },
                            },
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'startCursor',
                                loc: { start: 733, end: 744 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: undefined,
                              loc: { start: 733, end: 744 },
                            },
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'endCursor',
                                loc: { start: 755, end: 764 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: undefined,
                              loc: { start: 755, end: 764 },
                            },
                          ],
                          loc: { start: 673, end: 774 },
                        },
                        loc: { start: 664, end: 774 },
                      },
                      {
                        kind: 'Field',
                        alias: undefined,
                        name: {
                          kind: 'Name',
                          value: 'edges',
                          loc: { start: 783, end: 788 },
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'node',
                                loc: { start: 801, end: 805 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    alias: undefined,
                                    name: {
                                      kind: 'Name',
                                      value: 'id',
                                      loc: { start: 820, end: 822 },
                                    },
                                    arguments: [],
                                    directives: [],
                                    selectionSet: undefined,
                                    loc: { start: 820, end: 822 },
                                  },
                                  {
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'AnswerAdminCard_answer',
                                      loc: { start: 838, end: 860 },
                                    },
                                    directives: [],
                                    loc: { start: 835, end: 860 },
                                  },
                                  {
                                    kind: 'Field',
                                    alias: undefined,
                                    name: {
                                      kind: 'Name',
                                      value: '__typename',
                                      loc: { start: 873, end: 883 },
                                    },
                                    arguments: [],
                                    directives: [],
                                    selectionSet: undefined,
                                    loc: { start: 873, end: 883 },
                                  },
                                ],
                                loc: { start: 806, end: 895 },
                              },
                              loc: { start: 801, end: 895 },
                            },
                            {
                              kind: 'Field',
                              alias: undefined,
                              name: {
                                kind: 'Name',
                                value: 'cursor',
                                loc: { start: 906, end: 912 },
                              },
                              arguments: [],
                              directives: [],
                              selectionSet: undefined,
                              loc: { start: 906, end: 912 },
                            },
                          ],
                          loc: { start: 789, end: 922 },
                        },
                        loc: { start: 783, end: 922 },
                      },
                    ],
                    loc: { start: 590, end: 930 },
                  },
                  loc: { start: 503, end: 930 },
                },
              ],
              loc: { start: 486, end: 936 },
            },
            loc: { start: 467, end: 936 },
          },
          {
            kind: 'Field',
            alias: undefined,
            name: {
              kind: 'Name',
              value: 'id',
              loc: { start: 941, end: 943 },
            },
            arguments: [],
            directives: [],
            selectionSet: undefined,
            loc: { start: 941, end: 943 },
          },
        ],
        loc: { start: 446, end: 947 },
      },
      loc: { start: 424, end: 947 },
    },
  ],
};

export const query =
  'query QrCodeDetailAnswersQuery(\n' +
  '  $first: Int\n' +
  '  $last: Int\n' +
  '  $before: String\n' +
  '  $after: String\n' +
  '  $filters: AnswerFilter\n' +
  '  $id: ID!\n' +
  ') {\n' +
  '  ...QrCodeDetailAnswers_query_33Fm31\n' +
  '}\n' +
  '\n' +
  'fragment AnswerAdminCard_answer on AnswerAdmin {\n' +
  '  id\n' +
  '  createdAt\n' +
  '  risk\n' +
  '  qrcode {\n' +
  '    id\n' +
  '    name\n' +
  '    reference\n' +
  '  }\n' +
  '  user {\n' +
  '    id\n' +
  '    name\n' +
  '    email\n' +
  '  }\n' +
  '  answers {\n' +
  '    key\n' +
  '    value\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  'fragment QrCodeDetailAnswers_query_33Fm31 on Query {\n' +
  '  qrcode: node(id: $id) {\n' +
  '    __typename\n' +
  '    ... on QrCodeAdmin {\n' +
  '      id\n' +
  '      answers(first: $first, last: $last, before: $before, after: $after, filters: $filters) {\n' +
  '        endCursorOffset\n' +
  '        startCursorOffset\n' +
  '        count\n' +
  '        pageInfo {\n' +
  '          hasNextPage\n' +
  '          hasPreviousPage\n' +
  '          startCursor\n' +
  '          endCursor\n' +
  '        }\n' +
  '        edges {\n' +
  '          node {\n' +
  '            id\n' +
  '            ...AnswerAdminCard_answer\n' +
  '            __typename\n' +
  '          }\n' +
  '          cursor\n' +
  '        }\n' +
  '      }\n' +
  '    }\n' +
  '    id\n' +
  '  }\n' +
  '}\n';
