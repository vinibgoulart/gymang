import { setImmediate } from 'timers';

export const autoAdvanceTimers =
  <Result>(callback: () => Promise<Result>) =>
  async () => {
    const promise = callback();
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });
    while (!resolved) {
      await new Promise(setImmediate);
      if (jest.getTimerCount() === 0) {
        break;
      }
      jest.advanceTimersToNextTimer();
    }
    return await promise;
  };
