import WebSocket from 'ws';

export const isWsOpen = (ws: WebSocket) =>
  ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN;
