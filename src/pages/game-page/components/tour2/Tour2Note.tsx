import { Box, Center, Image, Text, useToast } from '@chakra-ui/react';
import IMAGES from 'constants/images';
import { useWindowDimensions } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { tour2Actions } from 'store/reducers/Tour2Slice';
import { MusicVariants } from 'types/IMusic';
import { INextNotePoint } from 'types/INextNotePoint';
import { INote } from 'types/INote';

interface Tour2NoteProps {
  note: INote;
  categoryId: number;
  categoryIndex: number;
  noteIndex: number;
}

const Tour2Note: FC<Tour2NoteProps> = ({
  note,
  categoryId,
  categoryIndex: ci,
  noteIndex: ni,
}) => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [tempPoints, setTempPoints] = useState<number>(note.points);
  const [pointsIncreaseInterval, setPointsIncreaseInterval] = useState<
    number | null
  >(null);
  const [isFirstTimeClicked, setIsFirstTimeClicked] = useState<boolean>(false);

  const activeNoteId = useAppSelector((state) => state.tour2.activeNoteId);
  const tour2Interval = useAppSelector((state) => state.tour2.tour2Interval);
  const nextNotePoints = useAppSelector((state) => state.tour2.nextNotePoints);
  const stopAllNoteIntervals = useAppSelector(
    (state) => state.tour2.stopAllNoteIntervals,
  );
  const pointsIncreaseRate = useAppSelector(
    (state) => state.tour2.pointsIncreaseRate,
  );
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

  useEffect(() => {
    if (nextNotePoints[ci] !== undefined) {
      if (pointsIncreaseInterval && playingNote.noteId !== note.id) {
        clearInterval(pointsIncreaseInterval);
        setPointsIncreaseInterval(null);

        const nextNotePoint: INextNotePoint = {
          ...nextNotePoints[ci],
          points: tempPoints,
          categoryIndex: ci,
        };

        dispatch(tour2Actions.editNextNotePoints(nextNotePoint));
      }
    }
  }, [stopAllNoteIntervals]);

  useEffect(() => {
    if (
      !isFirstTimeClicked &&
      ni !== 0 &&
      nextNotePoints[ci] !== undefined &&
      nextNotePoints[ci].lastNoteId === note.id
    ) {
      setIsFirstTimeClicked(true);
      setTempPoints(nextNotePoints[ci].points + note.points);
    }
  }, [nextNotePoints]);

  const showError = (description: string) => {
    toast({
      description,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const getNextNoteId = (nodeId: number) => {
    return nodeId + 1;
  };

  const tour2StartPointsInterval = (
    isPlaying: boolean,
    musicVariant: MusicVariants,
  ) => {
    setIsActivated(true);
    changePlayingNote(isPlaying, musicVariant);

    dispatch(tour2Actions.setActiveNoteId(note.id));
    dispatch(tour2Actions.setActiveCategoryId(categoryId));

    const interval = setInterval(() => {
      setTempPoints((prevState) => prevState + 1);
    }, pointsIncreaseRate);

    setPointsIncreaseInterval(interval);
  };

  const tour2StopPointsInterval = (pointsIncreaseInterval: number) => {
    changePlayingNote(false, MusicVariants.backingTrack);
    clearInterval(pointsIncreaseInterval);
    setPointsIncreaseInterval(null);

    const nextNotePoint: INextNotePoint = {
      lastNoteId: note.id,
      nextNoteId: getNextNoteId(note.id),
      points: tempPoints,
      categoryIndex: ci,
    };
    dispatch(tour2Actions.editNextNotePoints(nextNotePoint));
    dispatch(tour2Actions.setActiveCategoryId(0));
  };

  const clickHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (tour2Interval) {
      // При первом нажатии на первую ноту
      if (!note.backingTrack) {
        showError('Минусовка песни не найдена.');
        return;
      }
      if (ni > 0) return;

      clearInterval(tour2Interval);
      dispatch(tour2Actions.setTour2Interval(null));

      const nextNotePoint: INextNotePoint = {
        lastNoteId: note.id,
        nextNoteId: getNextNoteId(note.id),
        points: tempPoints,
        categoryIndex: ci,
      };
      dispatch(tour2Actions.editNextNotePoints(nextNotePoint));

      tour2StartPointsInterval(true, MusicVariants.backingTrack);
    } else {
      // play original
      if ((event.target as HTMLElement).tagName === 'ARTICLE') {
        if (!note.original) {
          showError('Песня не найдена.');
          return;
        }
        if (isActivated) {
          if (pointsIncreaseInterval) {
            tour2StopPointsInterval(pointsIncreaseInterval);
          }
          dispatch(tour2Actions.setActiveCategoryId(categoryId));
          dispatch(tour2Actions.setActiveNoteId(note.id));
          dispatch(tour2Actions.stopAllNoteIntervals());
          changePlayingNote(!isPlayingOriginal, MusicVariants.original);
        }
      } else {
        if (!note.backingTrack) {
          showError('Минусовка песни не найдена.');
          return;
        }

        let nextNoteId;
        dispatch(tour2Actions.stopAllNoteIntervals());

        if (nextNotePoints[ci] !== undefined) {
          nextNoteId = nextNotePoints[ci].nextNoteId;
        } else {
          if (ni === 0) {
            const nextNotePoint: INextNotePoint = {
              lastNoteId: note.id,
              nextNoteId: getNextNoteId(note.id),
              points: tempPoints,
              categoryIndex: ci,
            };
            dispatch(tour2Actions.editNextNotePoints(nextNotePoint));

            tour2StartPointsInterval(true, MusicVariants.backingTrack);
            return;
          }
        }

        if (nextNoteId === note.id) {
          // При нажатии на следующую ноту
          const nextNotePoint: INextNotePoint = {
            lastNoteId: note.id,
            nextNoteId: getNextNoteId(note.id),
            points: nextNotePoints[ci].points,
            categoryIndex: ci,
          };
          dispatch(tour2Actions.editNextNotePoints(nextNotePoint));

          tour2StartPointsInterval(true, MusicVariants.backingTrack);
        } else {
          if (pointsIncreaseInterval) {
            // Для остановки текущей ноты
            tour2StopPointsInterval(pointsIncreaseInterval);
          } else if (
            nextNotePoints[ci] !== undefined &&
            nextNotePoints[ci].lastNoteId === note.id
          ) {
            // Для запуска текущей ноты
            tour2StartPointsInterval(
              !isPlayingBackingTrack,
              MusicVariants.backingTrack,
            );
          }
        }
      }
    }

    if (isPlayingBackingTrack || isPlayingOriginal) {
      dispatch(tour2Actions.setActiveCategoryId(0));
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
        {isActivated && tempPoints}
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

export default Tour2Note;
