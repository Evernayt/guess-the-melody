import { Text, TextProps } from '@chakra-ui/react';
import { FC } from 'react';

const Tour4Timer: FC<TextProps> = (props) => {
  return (
    <Text
      {...props}
      pos="absolute"
      zIndex={99}
      color="#152b55"
      userSelect="none"
    >
      {props.children}
    </Text>
  );
};

export default Tour4Timer;
