import { Model } from 'mongoose';

export const withFindCursor =
  (
    model: Model<any>,
    condFn: (...p: any[]) => {
      conditions?: Record<string, unknown>;
      sort?: Record<string, unknown>;
    },
  ) =>
  (...params: any[]) => {
    const { conditions = {}, sort = {} } = condFn(...params);

    return model.find(conditions).sort(sort).cursor();
  };
