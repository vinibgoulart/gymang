import { ServerStyleSheets as MuiServerStyleSheets } from '@mui/styles';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

export type RenderComponent = {
  html?: string | null;
  styledComponentStyleTags?: string;
  muiStyleTags?: string;
  err?: Error;
};
export const renderComponent = (
  tree: ReactElement,
): RenderComponent => {
  const styledComponentsSheet = new ServerStyleSheet();
  const muiSheet = new MuiServerStyleSheets();

  try {
    const html = renderToString(
      styledComponentsSheet.collectStyles(muiSheet.collect(tree)),
    );

    const styledComponentStyleTags = styledComponentsSheet.getStyleTags();
    const muiStyleTags = muiSheet.toString();

    return {
      html,
      styledComponentStyleTags,
      muiStyleTags,
    };
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);

    return {
      err,
    };
  } finally {
    styledComponentsSheet.seal();
  }

  return {
    html: null,
  };
};
