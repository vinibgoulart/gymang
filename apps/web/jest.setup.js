import '@testing-library/jest-dom';

import { jestPreviewConfigure } from 'jest-preview';
jestPreviewConfigure({
  autoPreview: true,
});

// eslint-disable-next-line
require('jest-fetch-mock').enableMocks();

// eslint-disable-next-line
window.scrollTo = () => {};

jest.setTimeout(20000);

// jest.mock('@sentry/node');
// jest.mock('@sentry/tracing');
// jest.mock('@sentry/browser');
// jest.mock('@sentry/react');
jest.mock('./src/relay/relayEnvironment', () => {
  // eslint-disable-next-line
  const { createMockEnvironment } = require('relay-test-utils');

  return createMockEnvironment();
});

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

Element.prototype.scroll = jest.fn();
Element.prototype.scrollIntoView = jest.fn();

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
    },
  },
  offsetTop: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginTop) || 0;
    },
  },
  offsetHeight: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).height) || 0;
    },
  },
  offsetWidth: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).width) || 0;
    },
  },
});

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

global.navigator.geolocation = mockGeolocation;
// jest.mock('popper.js', () => {
//   const PopperJS = jest.requireActual('popper.js');
//
//   return class {
//     static placements = PopperJS.placements;
//
//     constructor() {
//       return {
//         destroy: jest.fn(),
//         scheduleUpdate: jest.fn(),
//         update: jest.fn(),
//       };
//     }
//   };
// });

// global.window.document.createRange = function createRange() {
//   return {
//     setEnd: () => {},
//     setStart: () => {},
//     getBoundingClientRect: () => {
//       return { right: 0 };
//     },
//     getClientRects: () => [],
//     commonAncestorContainer: document.createElement('div'),
//   };
// };
