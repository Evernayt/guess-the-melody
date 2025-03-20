import { Box, Center, Image, Text, useToast } from '@chakra-ui/react';
import IMAGES from 'constants/images';
import { useWindowDimensions } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, MouseEvent, useState } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { MusicVariants } from 'types/IMusic';
import { INote } from 'types/INote';

interface Tour1NoteProps {
  note: INote;
  categoryId: number;
}

const Tour1Note: FC<Tour1NoteProps> = ({ note, categoryId }) => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isActiveDoubleSharp, setIsActiveDoubleSharp] =
    useState<boolean>(false);
  const [doubleSharpInterval, setDoubleSharpInterval] = useState<number | null>(
    null,
  );

  const activeNoteId = useAppSelector((state) => state.tour1.activeNoteId);
  const playingNote = useAppSelector((state) => state.app.playingNote);

  const isPlayingBackingTrack =
    playingNote.noteId === note.id &&
    playingNote.isPlaying &&
    playingNote.musicVariant === MusicVariants.backingTrack;
  const isPlayingOriginal =
    playingNote.noteId === note.id &&
    playingNote.isPlaying &&
    playingNote.musicVariant === MusicVariants.original;

  const dispatch = useAppDispatch();

  const { height } = useWindowDimensions();
  const { setInterval, clearInterval } = window;

  const toast = useToast();

  const showError = (description: string) => {
    toast({
      description,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const clickHandler = (event: MouseEvent<HTMLDivElement>) => {
    // play original
    if ((event.target as HTMLElement).tagName === 'ARTICLE') {
      if (!note.original) {
        showError('Песня не найдена.');
        return;
      }

      if (isActivated) {
        if (isPlayingBackingTrack && !isActiveDoubleSharp) startDoubleSharp();

        dispatch(tour1Actions.setActiveCategoryId(categoryId));
        dispatch(tour1Actions.setActiveNoteId(note.id));

        changePlayingNote(!isPlayingOriginal, MusicVariants.original);
      }
    } else {
      if (!note.backingTrack) {
        showError('Минусовка песни не найдена.');
        return;
      }

      dispatch(tour1Actions.setActiveCategoryId(categoryId));
      dispatch(tour1Actions.setActiveNoteId(note.id));
      setIsActivated(true);

      if (doubleSharpInterval) {
        openQuestion();
        return;
      }

      if (isPlayingBackingTrack && !isActiveDoubleSharp) startDoubleSharp();
      changePlayingNote(!isPlayingBackingTrack, MusicVariants.backingTrack);
    }

    if (isPlayingBackingTrack || isPlayingOriginal) {
      dispatch(tour1Actions.setActiveCategoryId(0));
    }
  };

  const changePlayingNote = (
    isPlaying: boolean,
    musicVariant: MusicVariants,
  ) => {
    dispatch(
      appActions.setPlayingNote({
        noteId: note.id,
        relativePath: note[musicVariant]?.relativePath || '',
        originalStartTime:
          musicVariant === MusicVariants.original ? note.originalStartTime : 0,
        isPlaying,
        musicVariant,
      }),
    );
  };

  const startDoubleSharp = () => {
    if (note.doubleSharp) {
      setIsActiveDoubleSharp(true);
      const interval = setInterval(() => {
        setIsActiveDoubleSharp((prevState) => !prevState);
      }, 500);

      setDoubleSharpInterval(interval);
      return;
    }
  };

  const openQuestion = () => {
    if (doubleSharpInterval) {
      clearInterval(doubleSharpInterval);
      setDoubleSharpInterval(null);
      setIsActiveDoubleSharp(false);
    }
    if (note.doubleSharp !== null) {
      dispatch(
        modalActions.openModal({
          modal: 'questionModal',
          props: { doubleSharp: note.doubleSharp },
        }),
      );
    }
  };

  return (
    <Center
      cursor="pointer"
      pos="relative"
      h={height / 5}
      userSelect="none"
      onClick={clickHandler}
    >
      <Text
        fontFamily="TickingTimebombBbItalic"
        fontSize={`${height / 12}px`}
        mt={`${height / 12}px`}
        pos="absolute"
        color="white"
      >
        {isActivated && isActiveDoubleSharp ? '##' : isActivated && note.points}
      </Text>
      <Box
        as="article"
        pos="absolute"
        top="0"
        right="0"
        h={height / 12}
        w={height / 8}
        cursor="cell"
      />
      <Image
        src={activeNoteId === note.id ? IMAGES.note_on : IMAGES.note_off}
        maxH="100%"
      />
    </Center>
  );
};

export default Tour1Note;
