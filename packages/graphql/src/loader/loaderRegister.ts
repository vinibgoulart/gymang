import type DataLoader from 'dataloader';

export const getLoaderRegistry = () => {
  const loaders = {};

  const registerLoader = (key: string, getLoader: () => DataLoader) => {
    loaders[key] = getLoader;
  };

  const getDataloaders = () =>
    Object.keys(loaders).reduce(
      (prev, loaderKey: string) => ({
        ...prev,
        [loaderKey]: loaders[loaderKey](),
      }),
      {},
    );

  return {
    registerLoader,
    getDataloaders,
  };
};
