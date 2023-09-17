import { Readable } from 'stream';

export const itemsToReadableStream = (items: Record<string, unknown>[]) => {
  const s = new Readable();

  const header = Object.keys(items[0]).join(',');

  s.push(`${header}\n`);
  items.map((item) => {
    const line = Object.values(item).join(',');

    s.push(`${line}\n`);
  });
  s.push(null);

  return s;
};
