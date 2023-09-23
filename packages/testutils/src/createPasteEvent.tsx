export const createPasteEvent = (html: string) => {
  const text = html.replace('<[^>]*>', '');

  return {
    clipboardData: {
      types: ['text/plain', 'text/html'],
      getData: (type) => (type === 'text/plain' ? text : html),
    },
  };
};
