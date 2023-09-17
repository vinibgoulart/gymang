import GroupFixtureModel from './GroupFixtureModel';
import UserFixtureModel from './UserFixtureModel';

export interface TestGlobal extends NodeJS.Global {
  __COUNTERS__: Record<string, unknown>;
  __MONGO_URI__: string;
  __MONGO_DB_NAME__: string;
}

declare const global: TestGlobal;

export const getCounter = (key: string) => {
  if (key in global.__COUNTERS__) {
    const currentValue = global.__COUNTERS__[key];

    global.__COUNTERS__[key]++;

    return currentValue;
  }

  global.__COUNTERS__[key] = 0;

  return 0;
};

export const createMongooseUser = async (args: any = {}) => {
  const n = getCounter('user');

  return new UserFixtureModel({
    name: `User ${n}`,
    ...args,
  }).save();
};

export const createMongooseGroup = async (args: any = {}) => {
  const n = getCounter('group');

  return new GroupFixtureModel({
    name: `Group ${n}`,
    ...args,
  }).save();
};
