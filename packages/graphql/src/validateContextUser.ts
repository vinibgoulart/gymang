import { NullConnection } from './connection/NullConnection';

export const validateContextUser =
  (f: () => void) =>
  (...params: any[]) => {
    const [context] = params;
    if (!context.user) {
      return NullConnection;
    }

    return f(...params);
  };
