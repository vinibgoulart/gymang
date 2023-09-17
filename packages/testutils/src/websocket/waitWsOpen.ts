export const waitWsOpen = (ws: WebSocket) =>
  new Promise<void>((resolve) => {
    ws.on('open', () => {
      // eslint-disable-next-line
      console.log('websocket connected');
      resolve();
    });
  });
