import { Button, HStack } from '@chakra-ui/react';
import { FC, useState } from 'react';

interface ButtonWithConfirmProps {
  title: string;
  onConfirm: () => void;
}

const ButtonWithConfirm: FC<ButtonWithConfirmProps> = ({
  title,
  onConfirm,
}) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  return (
    <HStack>
      <Button disabled={isConfirming} onClick={() => setIsConfirming(true)}>
        {isConfirming ? `${title}?` : title}
      </Button>
      {isConfirming && (
        <HStack>
          <Button colorScheme="red" onClick={onConfirm}>
            Да
          </Button>
          <Button onClick={() => setIsConfirming(false)}>Нет</Button>
        </HStack>
      )}
    </HStack>
  );
};

export default ButtonWithConfirm;
