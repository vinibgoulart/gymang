import { IncomingMessage, Server } from 'http';
import EventEmitter from 'events';

export const adaptServerToGqls = (
  server: Server,
  gqlsEndpoint = '/graphql',
): Server => {
  const gqlsServerProxy = new EventEmitter();
  server.on('listening', gqlsServerProxy.emit.bind(gqlsServerProxy));
  server.on('error', gqlsServerProxy.emit.bind(gqlsServerProxy));
  server.on('upgrade', (req: IncomingMessage, ...rest: any[]) => {
    if (req.url === gqlsEndpoint) {
      gqlsServerProxy.emit('upgrade', req, ...rest);
    }
  });
  return gqlsServerProxy;
};
