import { RefObject } from 'react';

export default function sleep(ms: number, ref: RefObject<boolean>) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);

    const interval = setInterval(() => {
      if (!ref.current) {
        reject('sleep stopped');
        clearInterval(interval);
      }
    }, 500);
  });
}
