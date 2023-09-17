/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import { stableCopy } from './stableCopy';

export type Arguments = { [argName: string]: unknown };

/**
 * Given a name and argument values, format a storage key.
 *
 * Arguments and the values within them are expected to be ordered in a stable
 * alphabetical ordering.
 */
export const formatStorageKey = (
  name: string,
  argValues: Arguments | null,
): string => {
  if (!argValues) {
    return name;
  }

  const values = [];
  for (const argName in argValues) {
    // eslint-disable-next-line no-prototype-builtins
    if (argValues.hasOwnProperty(argName)) {
      const value = argValues[argName];
      if (value != null) {
        // any(>=0.95.0) JSON.stringify can return undefined
        values.push(`${argName}:${JSON.stringify(value)}`);
      }
    }
  }
  return values.length === 0 ? name : `${name}(${values.join(',')})`;
};

/**
 * Given a `name` (eg. "foo") and an object representing argument values
 * (eg. `{orberBy: "name", first: 10}`) returns a unique storage key
 * (ie. `foo{"first":10,"orderBy":"name"}`).
 *
 * This differs from getStorageKey which requires a ConcreteNode where arguments
 * are assumed to already be sorted into a stable order.
 */
export const getStableStorageKey = (
  name: string,
  args: Arguments | null,
): string => formatStorageKey(name, stableCopy(args));
