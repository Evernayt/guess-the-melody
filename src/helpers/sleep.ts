import { RefObject } from 'react';

const sleep = (ms: number, ref: RefObject<boolean>): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);

    const interval = setInterval(() => {
      if (!ref.current) {
        reject('sleep stopped');
        clearInterval(interval);
      }
    }, 500);
  });
};

export default sleep;
