import { Box, Image, ImageProps } from '@chakra-ui/react';
import { FC } from 'react';
import { IStatesSevenNote } from 'types/IStatesSevenNote';

interface Tour4NoteProps {
  statesSevenNote: IStatesSevenNote;
  isPlaying: boolean;
}

const Tour4Note: FC<Tour4NoteProps> = ({ statesSevenNote, isPlaying }) => {
  return (
    <Box position="relative">
      {!statesSevenNote.isGuessed && (
        <Image
          className={isPlaying ? 'animate2' : ''}
          src={statesSevenNote.offImage}
          minW="10px"
          pointerEvents="none"
          userSelect="none"
          position="absolute"
        />
      )}
      <Image
        src={statesSevenNote.onImage}
        minW="10px"
        pointerEvents="none"
        userSelect="none"
      />
    </Box>
  );
};

export const Tour4StaticNote: FC<ImageProps> = (props) => {
  return (
    <Image {...props} minW="10px" pointerEvents="none" userSelect="none" />
  );
};

export default Tour4Note;
