import { getNodeInterfaceSelections } from '../getNodeInterfaceSelections';
import { simpleInfo } from '../__fixtures__/simple';
import { complexInfo } from '../__fixtures__/complex';

it('should return a list of user selections on node interface', () => {
  const nodeSelections = getNodeInterfaceSelections(simpleInfo);

  expect(nodeSelections).toEqual(['QrCode', 'QrCodeAdmin']);
});

it('should handle complex queries', () => {
  const nodeSelections = getNodeInterfaceSelections(complexInfo);

  expect(nodeSelections).toEqual(['QrCodeAdmin']);
});
