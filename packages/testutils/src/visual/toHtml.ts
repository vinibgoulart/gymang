import type { ReactElement } from 'react';

import { renderComponent } from './renderComponent';
import { renderHtml } from './renderHtml';

export const toHtml = (tree: ReactElement) => {
  const { html, styledComponentStyleTags, muiStyleTags } =
    renderComponent(tree);

  if (html) {
    return renderHtml({
      assets: {},
      html,
      styledComponentStyleTags,
      muiStyleTags,
    });
  }

  return '';
};
