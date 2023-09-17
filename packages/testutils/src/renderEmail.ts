import { getQueriesForElement } from '@testing-library/dom';
import { JSDOM } from 'jsdom';

import type { SesCall } from './emailHelpers';

export const renderEmail = (email: SesCall) => {
  const dom = new JSDOM(email.Message.Body.Html.Data);

  const screen = getQueriesForElement(dom.window.document);

  const debugPreview = () => {
    // lazy load
    // eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires, testing-library/no-debugging-utils
    require('jest-preview').debug(dom.window);
  };

  screen.debug = debugPreview;

  return {
    screen,
    debugPreview,
  };
};
