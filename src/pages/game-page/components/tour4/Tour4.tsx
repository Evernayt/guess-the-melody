import { useWindowDimensions } from 'hooks';
import { useAppSelector } from 'hooks/redux';
import { useEffect, useRef, useState } from 'react';
import { INITIAL_STATES_SEVBEN_NOTES } from 'constants/initialStates';
import { IStatesSevenNote } from 'types/IStatesSevenNote';
import {
  Button,
  Center,
  HStack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import IMAGES from 'constants/images';
import Tour4Note, { Tour4StaticNote } from './Tour4Note';
import Tour4Timer from './Tour4Timer';
import {
  IconPlayerPlayFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerStopFilled,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import Congratulation from './congratulation/Congratulation';

const getGuessedNotesText = (guessedCount: number) => {
  let noteText = '';
  if (guessedCount === 1) {
    noteText = 'ноту';
  } else if (guessedCount < 5) {
    noteText = 'ноты';
  } else {
    noteText = 'нот';
  }
  return `Вы угадали ${guessedCount} ${noteText}`;
};

const Tour4 = () => {
  const initialTimer = useAppSelector((state) => state.tour4.initialTimer);

  const [statesSevenNotes, setStatesSevenNotes] = useState<IStatesSevenNote[]>(
    INITIAL_STATES_SEVBEN_NOTES,
  );
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(initialTimer);
  const [stopped, setStopped] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [nextSevenNoteIndex, setNextSevenNoteIndex] = useState<number>(0);
  const [guessedCount, setGuessedCount] = useState<number>(0);
  const [disableSkip, setDisableSkip] = useState<boolean>(false);

  const tour4 = useAppSelector((state) => state.tour4.tour4);
  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const audioRef = useRef<HTMLAudioElement>(null);

  const roundedTimer = Math.round(timer);
  const isSupergameWon = guessedCount === 7;
  const isFinished = timer <= 0 || isSupergameWon;

  const { width } = useWindowDimensions();
  const { setInterval, clearInterval } = window;

  const toast = useToast();

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const showError = (description: string) => {
    toast({
      description,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const start = () => {
    if (!tour4.sevenNotes[nextSevenNoteIndex].backingTrack) {
      showError(`Песня для ${nextSevenNoteIndex + 1} ноты — не найдена`);
      return;
    }

    setStopped(false);
    playMusic();

    let timerClone = timer;
    const interval = setInterval(() => {
      timerClone -= 0.1;
      if (timerClone <= 0) {
        clearInterval(interval);
        setTimerInterval(null);
        setIsPending(true);
        setTimer(0);
        pauseMusic();
        return;
      }
      setTimer(timerClone);
    }, 100);

    setTimerInterval(interval);
  };

  const stop = () => {
    pauseMusic();

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setStopped(true);
      setIsPending(true);
    }
  };

  const guessed = () => {
    let guessedCountClone = guessedCount;
    guessedCountClone++;

    setStopped(false);
    setIsPending(false);

    const sevenNotesClone: IStatesSevenNote[] =
      structuredClone(statesSevenNotes);
    sevenNotesClone[nextSevenNoteIndex].isSkipped = false;
    sevenNotesClone[nextSevenNoteIndex].isGuessed = true;

    setStatesSevenNotes(sevenNotesClone);

    setNextSevenNoteIndex(nextSevenNoteIndex + 1);

    setGuessedCount(guessedCountClone);

    if (guessedCountClone === 7) {
      setIsPending(true);
      return;
    }

    if (sevenNotesClone[6].isGuessed || sevenNotesClone[6].isSkipped) {
      if (!disableSkip) setDisableSkip(true);
      for (let i = 0; i < sevenNotesClone.length; i++) {
        if (sevenNotesClone[i].isSkipped) {
          setNextSevenNoteIndex(i);
          return;
        }
      }
    }
  };

  const skip = () => {
    setStopped(false);
    setIsPending(false);

    const sevenNotesClone: IStatesSevenNote[] =
      structuredClone(statesSevenNotes);
    sevenNotesClone[nextSevenNoteIndex].isSkipped = true;

    setStatesSevenNotes(sevenNotesClone);

    setNextSevenNoteIndex(nextSevenNoteIndex + 1);

    if (sevenNotesClone[6].isGuessed || sevenNotesClone[6].isSkipped) {
      if (!disableSkip) setDisableSkip(true);
      for (let i = 0; i < sevenNotesClone.length; i++) {
        if (sevenNotesClone[i].isSkipped) {
          setNextSevenNoteIndex(i);
          return;
        }
      }
    }
  };

  const playMusic = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const pauseMusic = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  return (
    <VStack h="calc(100vh - 82px)" justifyContent="center">
      {isFinished && <Congratulation isSupergameWon={isSupergameWon} />}
      <HStack gap={0}>
        <Tour4StaticNote src={IMAGES.seven_notes_off_1} />
        <Center>
          <Tour4StaticNote src={IMAGES.seven_notes_off_2} />
          <Tour4Timer fontSize={`${width / 10}px`}>
            {roundedTimer < 10 ? '0' : roundedTimer.toString().slice(0, 1)}
          </Tour4Timer>
        </Center>
        <Center>
          <Tour4StaticNote src={IMAGES.seven_notes_off_3} />
          <Tour4Timer fontSize={`${width / 10}px`}>
            {roundedTimer < 10
              ? roundedTimer.toString()
              : roundedTimer.toString().slice(1)}
          </Tour4Timer>
        </Center>
        {statesSevenNotes.map((statesSevenNote, index) => (
          <Tour4Note
            statesSevenNote={statesSevenNote}
            isPlaying={timerInterval !== null && nextSevenNoteIndex === index}
            key={statesSevenNote.id}
          />
        ))}
      </HStack>

      <HStack>
        {tour4.sevenNotes[nextSevenNoteIndex] !== undefined && (
          <audio
            src={
              tour4.sevenNotes[nextSevenNoteIndex].backingTrack
                ? `${assetsPath}\\${tour4.sevenNotes[nextSevenNoteIndex].backingTrack?.relativePath}`
                : ''
            }
            ref={audioRef}
            style={{ display: 'none' }}
          />
        )}

        {!timerInterval && !isPending && (
          <Button
            leftIcon={<IconPlayerPlayFilled size={20} />}
            colorScheme="purple"
            size="lg"
            onClick={start}
          >
            {timer === initialTimer ? 'Старт' : 'Продолжить'}
          </Button>
        )}
        {timerInterval && (
          <Button
            leftIcon={<IconPlayerStopFilled size={20} />}
            colorScheme="purple"
            size="lg"
            onClick={stop}
          >
            Стоп
          </Button>
        )}
        {stopped && (
          <>
            <Button
              leftIcon={<IconThumbUpFilled size={20} />}
              colorScheme="green"
              size="lg"
              onClick={guessed}
            >
              Угадано
            </Button>
            {!disableSkip && (
              <Button
                leftIcon={<IconPlayerSkipForwardFilled size={20} />}
                size="lg"
                onClick={skip}
              >
                Пропуск
              </Button>
            )}
          </>
        )}
      </HStack>
      {isFinished && (
        <Text fontSize="sm" color="gray.400">
          {getGuessedNotesText(guessedCount)}
        </Text>
      )}
    </VStack>
  );
};

export default Tour4;
