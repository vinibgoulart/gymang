// import Redis from 'ioredis-mock';
// import * as XLSX from 'xlsx';

import { clearDbAndRestartCounters } from './clearDatabase';

// clear database
// clear counters
// clear redis
// clear mocks
// clear elastic search
export const cleanupTest = async () => {
  if (typeof jest === 'undefined') {
    return;
  }

  // jest env
  const fetchMock = require('jest-fetch-mock');

  await clearDbAndRestartCounters();
  // await new Redis().flushall();
  // XLSX.utils.json_to_sheet.mockClear();
  fetchMock.resetMocks();

  // fetchMock.mockClear();
  // move to clearMock: true on jest.config.js - https://jestjs.io/docs/configuration#clearmocks-boolean
  // if (jest) {
  //   jest.clearAllMocks();
  // }
};
