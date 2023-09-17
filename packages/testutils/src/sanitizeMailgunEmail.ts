import { set } from 'lodash';

export type MailgunMock = {
  client: {
    mock: {
      results: {
        value: {
          messages: {
            create: {
              mock: {
                calls: [
                  [
                    string | null,
                    {
                      from: string;
                      to: string;
                      subject: string;
                      html: string;
                      text: string;
                    },
                  ],
                ];
              };
            };
          };
        };
      }[];
    };
  };
};

// Email data can change, so we make it fixed for now
export const sanitizeMailgunEmail = (clientMock: MailgunMock) => {
  const frozenEmailMailgunDataKey = 'html';

  const { results } = clientMock.client.mock;

  const sanitized = results.map((result) => {
    const call = result.value.messages.create.mock.calls[0][1];

    set(call, frozenEmailMailgunDataKey, 'FIXED_DATA');

    return call;
  });

  return sanitized;
};
