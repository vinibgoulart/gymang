import { fireEvent, screen } from '@testing-library/react';

export const openCollapsible = () => {
  const expandButton = screen.getByTestId('ExpandMoreIcon');

  fireEvent.click(expandButton);
};
