import moment, { type Moment } from 'moment';
import { useState, useEffect } from 'react';

export const useElapsedTime = (time: Moment) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    const updateElapsedTime = () => {
      const now = moment();
      const diff = now.diff(time);
      const formattedTime = moment.utc(diff).format('HH:mm:ss');
      setElapsedTime(formattedTime);
    };

    updateElapsedTime();

    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [time]);

  return elapsedTime;
};
