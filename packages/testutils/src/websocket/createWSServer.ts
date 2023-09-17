import http from 'http';
import net from 'net';

import { Koa } from 'koa';

import { serverAddress } from './serverAddress';

type WSServerResult = {
  address: string;
  dispose: () => Promise<void>;
};

export const createWSServer = (app: Koa): WSServerResult => {
  const server = http.createServer(app.callback());

  const sockets = new Set<net.Socket>();
  server.on('connection', (socket) => {
    sockets.add(socket);
    server.once('close', () => sockets.delete(socket));
  });

  const disposeServer = () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });

  const disposeSockets = () => {
    for (const socket of sockets) {
      socket.destroy();
      sockets.delete(socket);
    }
  };

  const dispose = async () => {
    disposeSockets();
    await disposeServer();
  };

  const address = serverAddress(server);

  return {
    address,
    dispose,
  };
};
