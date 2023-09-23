/**
 * https://github.com/react-dropzone/react-dropzone/blob/master/src/index.spec.js#L3576
 * createDtWithFiles creates a mock data transfer object that can be used for drop events
 * @param {File[]} files
 */
export const createDtWithFiles = (files: File[] = []) => {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
};
