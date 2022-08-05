import { useEffect, useState } from 'react';

const useKeyPress = (
  targetKeys: string[],
  handler: () => void
): { rerender: () => void } => {
  const [isRerender, setIsRerender] = useState<boolean>(false);

  function downHandler({ key }: KeyboardEvent): void {
    if (targetKeys.includes(key)) {
      handler();
    }
  }

  function rerender() {
    setIsRerender((prevState) => !prevState);
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [isRerender]);

  return { rerender };
};

export default useKeyPress;
