import type { Location } from 'history';

type LocationType = {
  host?: string;
  href?: string;
} & Partial<Location>;

export const mockWindowLocation = (location: LocationType) => {
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = location;
};
