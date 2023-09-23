import * as util from 'util';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  // eslint-disable-next-line
  require('promise/lib/rejection-tracking').enable();
  // eslint-disable-next-line
  window.Promise = require('promise/lib/es6-extensions.js');
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
// eslint-disable-next-line
Object.assign = require('object-assign');

// localStorage mock
const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

window.localStorage = localStorageMock;

// This is a workaround for https://github.com/jsdom/jsdom/issues/2524#issuecomment-902027138
//
// We have a few tests that intentionally load a fresh JSDOM context (to test in an isolated
// document) from within a JSDOM-based environment (because several of our dependencies expect
// global window APIs to be available).
window.TextEncoder = util.TextEncoder;
window.TextDecoder = util.TextDecoder;

// avoid indexing elastic search on tests, we should mock instead
process.env.GRAPHQL_URL = 'https://api.gymang.com/gymang';
process.env.WEBHOOK_PUBLIC_KEY =
  'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEVDdWYStxb3pvT2NYUStjSHJWNk85RVE0TgpnZVhvY1ZwRFBBWkpTZVJsbEVlQVVha051MURqY3FweDFmb1l5aEZxRTM3TkNWYzRtK0hvTC9nN1k3VDMyZVJ4CjhpandxMjdoY0ZjL0RFc01ISWdVU0U4cGdPbi96a3ZadXdNb256MkVjdy85NzZzTlUzNnpKOXhMUE53dURnSysKb2dUb0RQTmNkaWtRdi9STHFRSURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=';
process.env.GYMANG_ENV = 'testing';
