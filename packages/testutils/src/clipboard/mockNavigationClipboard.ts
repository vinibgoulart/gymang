export const mockNavigationClipboard = () => {
  const mockPermissionStatus = {
    state: 'granted',
    onchange: null,
  };

  const mockPermissions = {
    query: jest.fn(() => Promise.resolve(mockPermissionStatus)),
  };

  const mockClipboard = {
    readText: jest.fn(),
    writeText: jest.fn(),
    // Add any other methods or properties you need to mock
  };

  Object.defineProperty(window.navigator, 'clipboard', {
    value: mockClipboard,
  });
  Object.defineProperty(window.navigator, 'permissions', {
    value: mockPermissions,
  });
};
