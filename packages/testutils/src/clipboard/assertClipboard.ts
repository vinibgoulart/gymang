export const assertClipboard = (text: string) => {
  expect(window.navigator.clipboard.writeText.mock.calls[0][0]).toBe(text);
};
