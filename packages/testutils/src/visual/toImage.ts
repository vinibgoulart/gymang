import htmlToImage from 'node-html-to-image';
import type { ReactElement } from 'react';

import { toHtml } from './toHtml';

export const toImage = async (tree: ReactElement) => {
  const html = toHtml(tree);

  const image = await htmlToImage({
    html,
  });

  return image;
};
