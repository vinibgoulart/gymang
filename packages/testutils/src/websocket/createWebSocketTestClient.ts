import WebSocket from 'ws';

export const createWebSocketTestClient = (
  url: string,
  protocols: string | string[],
) => {
  let closeEvent: WebSocket.CloseEvent;
  const queue: WebSocket.MessageEvent[] = [];
  return new Promise<{
    ws: WebSocket;
    waitForMessage: (
      test: (data: WebSocket.MessageEvent) => void,
      expire?: number,
    ) => Promise<void>;
    waitForClose: (
      test?: (event: WebSocket.CloseEvent) => void,
      expire?: number,
    ) => Promise<void>;
  }>((resolve) => {
    const ws = new WebSocket(url, protocols);
    ws.onclose = (event) => (closeEvent = event); // just so that none are missed
    ws.onmessage = (message) => queue.push(message); // guarantee message delivery with a queue
    ws.once('open', () =>
      resolve({
        ws,
        async waitForMessage(test, expire) {
          return new Promise((messageResolve) => {
            const done = () => {
              // the onmessage listener above will be called before our listener, populating the queue
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              test(queue.shift()!);
              messageResolve();
            };
            if (queue.length > 0) {
              return done();
            }
            ws.once('message', done);
            if (expire) {
              setTimeout(() => {
                ws.removeListener('message', done); // expired
                messageResolve();
              }, expire);
            }
          });
        },
        async waitForClose(
          test?: (event: WebSocket.CloseEvent) => void,
          expire?: number,
        ) {
          return new Promise((closeResolve) => {
            if (closeEvent) {
              if (test) test(closeEvent);
              return closeResolve();
            }
            ws.onclose = (event) => {
              closeEvent = event;
              if (test) test(event);
              closeResolve();
            };
            if (expire) {
              setTimeout(() => {
                ws.onclose = null; // expired
                closeResolve();
              }, expire);
            }
          });
        },
      }),
    );
  });
};
