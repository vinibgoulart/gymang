import prettyFormat from 'pretty-format';

import { relayTransform } from './debugUtils';

export const consoleAll = (val: any) => {
  const safeValue = JSON.parse(JSON.stringify(val, relayTransform));

  // eslint-disable-next-line
  console.log(prettyFormat(safeValue));
};
