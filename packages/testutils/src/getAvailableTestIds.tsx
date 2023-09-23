export const getAvailableTestIds = () => {
  // eslint-disable-next-line
  console.log(
    new Set(
      [...document.querySelectorAll('[data-testid]')].map(
        (el) => el.dataset.testid,
      ),
    ),
  );
};
