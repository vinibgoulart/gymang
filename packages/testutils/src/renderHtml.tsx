import { prettyDOM, within } from '@testing-library/react';
import { JSDOM } from 'jsdom';

export const renderHtml = (html: string) => {
  const {
    window,
  } = new JSDOM(html);

  global.document = window.document;
  global.window = window;

  const container = JSDOM.fragment(html);

  document.adoptNode(container);
  (container as any).outerHTML = html; // Fixes prettyDOM for container

  return {
    document: window.document,
    container,
    debug(el?: ParentNode) {
      if (el) {
        // eslint-disable-next-line
        console.log(prettyDOM(el as HTMLElement));
      } else {
        // eslint-disable-next-line
        console.log(
          ...[].map.call(container.children, (child: HTMLElement) =>
            prettyDOM(child),
          ),
        );
      }
    },
    ...within(container),
  };
};
