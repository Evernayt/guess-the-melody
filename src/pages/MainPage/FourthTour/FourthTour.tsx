import { Button } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import {
  SEVEN_NOTES_OFF_1,
  SEVEN_NOTES_OFF_2,
  SEVEN_NOTES_OFF_3,
  SEVEN_NOTES_OFF_10,
  SEVEN_NOTES_OFF_4,
  SEVEN_NOTES_OFF_5,
  SEVEN_NOTES_OFF_6,
  SEVEN_NOTES_OFF_7,
  SEVEN_NOTES_OFF_8,
  SEVEN_NOTES_OFF_9,
  SEVEN_NOTES_ON_10,
  SEVEN_NOTES_ON_4,
  SEVEN_NOTES_ON_5,
  SEVEN_NOTES_ON_6,
  SEVEN_NOTES_ON_7,
  SEVEN_NOTES_ON_8,
  SEVEN_NOTES_ON_9,
} from 'constants/images';
import { createClone } from 'helpers';
import { useWindowDimensions } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { CSSProperties, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { setErrorAction } from 'store/reducers/AppSlice';
import styles from './FourthTour.module.css';

interface IStatesSevenNote {
  id: number;
  offImage: string;
  onImage: string;
  isGuessed: boolean;
  isSkipped: boolean;
}

const initialStatesSevenNotes: IStatesSevenNote[] = [
  {
    id: 1,
    offImage: SEVEN_NOTES_OFF_4,
    onImage: SEVEN_NOTES_ON_4,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 2,
    offImage: SEVEN_NOTES_OFF_5,
    onImage: SEVEN_NOTES_ON_5,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 3,
    offImage: SEVEN_NOTES_OFF_6,
    onImage: SEVEN_NOTES_ON_6,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 4,
    offImage: SEVEN_NOTES_OFF_7,
    onImage: SEVEN_NOTES_ON_7,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 5,
    offImage: SEVEN_NOTES_OFF_8,
    onImage: SEVEN_NOTES_ON_8,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 6,
    offImage: SEVEN_NOTES_OFF_9,
    onImage: SEVEN_NOTES_ON_9,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 7,
    offImage: SEVEN_NOTES_OFF_10,
    onImage: SEVEN_NOTES_ON_10,
    isGuessed: false,
    isSkipped: false,
  },
];

const bigButtonStyle: CSSProperties = {
  height: '50px',
  padding: '0 40px',
  fontSize: '16px',
  fontWeight: 'bold',
};

const FourthTour = () => {
  const initialTimer = useAppSelector((state) => state.fourthTour.initialTimer);

  const [statesSevenNotes, setStatesSevenNotes] = useState<IStatesSevenNote[]>(
    initialStatesSevenNotes
  );
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState<number>(initialTimer);
  const [stopped, setStopped] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [nextSevenNoteIndex, setNextSevenNoteIndex] = useState<number>(0);
  const [guessedCount, setGuessedCount] = useState<number>(0);
  const [disableSkip, setDisableSkip] = useState<boolean>(false);

  const fourthTour = useAppSelector((state) => state.fourthTour.fourthTour);
  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const audioRef = useRef<ReactAudioPlayer>(null);

  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions();

  const start = () => {
    if (!fourthTour.sevenNotes[nextSevenNoteIndex].backingTrack) {
      dispatch(
        setErrorAction(`Песня для ${nextSevenNoteIndex + 1} ноты не найдена`)
      );
      return;
    }

    setStopped(false);
    playMusic();

    let timerClone = timer - 1;
    setTimer(timerClone);
    const interval = setInterval(() => {
      timerClone--;
      if (timerClone === 0) {
        clearInterval(interval);
        setTimerInterval(null);
        setIsPending(true);
        setTimer(0);
        return;
      }
      setTimer(timerClone);
    }, 800);

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

    const sevenNotesClone: IStatesSevenNote[] = createClone(statesSevenNotes);
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
      for (let index = 0; index < sevenNotesClone.length; index++) {
        if (sevenNotesClone[index].isSkipped) {
          setNextSevenNoteIndex(index);
          return;
        }
      }
    }
  };

  const skip = () => {
    setStopped(false);
    setIsPending(false);

    const sevenNotesClone: IStatesSevenNote[] = createClone(statesSevenNotes);
    sevenNotesClone[nextSevenNoteIndex].isSkipped = true;

    setStatesSevenNotes(sevenNotesClone);

    setNextSevenNoteIndex(nextSevenNoteIndex + 1);

    if (sevenNotesClone[6].isGuessed || sevenNotesClone[6].isSkipped) {
      if (!disableSkip) setDisableSkip(true);
      for (let index = 0; index < sevenNotesClone.length; index++) {
        if (sevenNotesClone[index].isSkipped) {
          setNextSevenNoteIndex(index);
          return;
        }
      }
    }
  };

  const playSkippedMusic = () => {};

  const playMusic = () => {
    audioRef.current?.audioEl.current?.play();
  };

  const pauseMusic = () => {
    audioRef.current?.audioEl.current?.pause();
  };

  // const musicIsPlaying = (): boolean => {
  //   return !audioRef.current?.audioEl.current?.paused;
  // };

  return (
    <div className={styles.container}>
      <div className={styles.notes_img_container}>
        <img className={styles.notes_img} src={SEVEN_NOTES_OFF_1} />
        <div className={styles.timer_note}>
          <img className={styles.notes_img} src={SEVEN_NOTES_OFF_2} />
          <div className={styles.timer} style={{ fontSize: `${width / 10}px` }}>
            {timer < 10 ? '0' : timer.toString().slice(0, 1)}
          </div>
        </div>
        <div className={styles.timer_note}>
          <img className={styles.notes_img} src={SEVEN_NOTES_OFF_3} />
          <div className={styles.timer} style={{ fontSize: `${width / 10}px` }}>
            {timer < 10 ? timer.toString() : timer.toString().slice(1)}
          </div>
        </div>
        {statesSevenNotes.map((statesSevenNote) => (
          <img
            className={styles.notes_img}
            src={
              statesSevenNote.isGuessed
                ? statesSevenNote.onImage
                : statesSevenNote.offImage
            }
            onClick={playSkippedMusic}
            key={statesSevenNote.id}
          />
        ))}
      </div>

      <div className={styles.controls}>
        {fourthTour.sevenNotes[nextSevenNoteIndex] !== undefined && (
          <ReactAudioPlayer
            src={
              fourthTour.sevenNotes[nextSevenNoteIndex].backingTrack
                ? assetsPath +
                  '\\' +
                  fourthTour.sevenNotes[nextSevenNoteIndex].backingTrack?.path
                : ''
            }
            controls={false}
            ref={audioRef}
            volume={volume}
          />
        )}

        {!timerInterval && !isPending && (
          <Button
            variant={ButtonVariants.primary}
            style={bigButtonStyle}
            onClick={start}
          >
            {timer === 30 ? 'Старт' : 'Продолжить'}
          </Button>
        )}
        {timerInterval && (
          <Button
            variant={ButtonVariants.primary}
            style={bigButtonStyle}
            onClick={stop}
          >
            Стоп
          </Button>
        )}
        {stopped && (
          <>
            <Button
              variant={ButtonVariants.success}
              style={bigButtonStyle}
              onClick={guessed}
            >
              Угадано
            </Button>
            {!disableSkip && (
              <Button style={bigButtonStyle} onClick={skip}>
                Пропуск
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FourthTour;
