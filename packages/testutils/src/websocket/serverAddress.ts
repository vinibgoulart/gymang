import { Server } from 'http';

// similar approach from supertest
export const serverAddress = (server: Server): string => {
  const addr = server.address();

  server.once('error', (e) => {
    // eslint-disable-next-line
    console.log('serverAddress: ', e);
  });

  server.once('listening', () => {
    // eslint-disable-next-line
    console.log('listening');
  });

  if (!addr) {
    server.listen(0);
  }

  const port = server.address().port;
  const path = '';

  return `localhost:${port}${path}`;
};
