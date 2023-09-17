/*
query {
  node(id:"UXJDb2RlOjVmYmVhMzNmM2NhNzcyMGYwOTM2ZDQ3Nw==") {
    ... on QrCode {
      name
    }
    ... on QrCodeAdmin {
      name
    }
  }
}
 */

export const simpleInfo = {
  fieldNodes: [
    {
      kind: 'Field',
      alias: undefined,
      name: { kind: 'Name', value: 'node', loc: { start: 10, end: 14 } },
      arguments: [
        {
          kind: 'Argument',
          name: { kind: 'Name', value: 'id', loc: { start: 15, end: 17 } },
          value: {
            kind: 'StringValue',
            value: 'UXJDb2RlOjVmYmVhMzNmM2NhNzcyMGYwOTM2ZDQ3Nw==',
            block: false,
            loc: { start: 18, end: 64 },
          },
          loc: { start: 15, end: 64 },
        },
      ],
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'QrCode',
                loc: { start: 79, end: 85 },
              },
              loc: { start: 79, end: 85 },
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
                    value: 'name',
                    loc: { start: 94, end: 98 },
                  },
                  arguments: [],
                  directives: [],
                  selectionSet: undefined,
                  loc: { start: 94, end: 98 },
                },
              ],
              loc: { start: 86, end: 104 },
            },
            loc: { start: 72, end: 104 },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'QrCodeAdmin',
                loc: { start: 116, end: 127 },
              },
              loc: { start: 116, end: 127 },
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
                    value: 'name',
                    loc: { start: 136, end: 140 },
                  },
                  arguments: [],
                  directives: [],
                  selectionSet: undefined,
                  loc: { start: 136, end: 140 },
                },
              ],
              loc: { start: 128, end: 146 },
            },
            loc: { start: 109, end: 146 },
          },
        ],
        loc: { start: 66, end: 150 },
      },
      loc: { start: 10, end: 150 },
    },
  ],
};
