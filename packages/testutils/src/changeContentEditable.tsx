import { createEvent, fireEvent } from '@testing-library/react';

import { createPasteEvent } from './createPasteEvent';

type ChangeContentEditable = {
  container: HTMLElement;
  value: string;
};
export const changeContentEditable = ({
  container,
  value,
}: ChangeContentEditable) => {
  // TODO - make it work with many rich text fields
  const editorNode = container.querySelector('.public-DraftEditor-content');
  const eventProperties = createPasteEvent(value);
  const pasteEvent = createEvent.paste(editorNode, eventProperties);

  fireEvent(editorNode, pasteEvent);
  fireEvent.blur(editorNode);
};

export const contentEditableChange = (node, value) => {
  const eventProperties = createPasteEvent(value);
  const pasteEvent = createEvent.paste(node, eventProperties);

  fireEvent(node, pasteEvent);
  fireEvent.blur(node);
  // fireEvent.blur(node, {target: {textContent: value}});
};
