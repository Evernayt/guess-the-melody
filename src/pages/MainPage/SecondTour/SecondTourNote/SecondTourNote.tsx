import { FC, useEffect, useRef, useState } from 'react';
import { NOTE_OFF, NOTE_ON } from 'constants/images';
import ReactAudioPlayer from 'react-audio-player';
import styles from './SecondTourNote.module.css';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useWindowDimensions } from 'hooks';
import { setErrorAction, setStopAllMusicAction } from 'store/reducers/AppSlice';
import { INote } from 'models/INote';
import { ICategory } from 'models/ICategory';
import { INextNoteNumber } from 'models/INextNoteNumber';
import {
  editNextNoteNumberAction,
  setSecondTourActiveCategoryIdAction,
  setSecondTourActiveNoteIdAction,
  setSecondTourIntervalAction,
  stopAllNoteIntervalsAction,
} from 'store/reducers/SecondTourSlice';

interface SecondTourNoteProps {
  note: INote;
  category: ICategory;
  categoryIndex: number;
  noteIndex: number;
}

const SecondTourNote: FC<SecondTourNoteProps> = ({
  note,
  category,
  categoryIndex,
  noteIndex,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [tempNumber, setTempNumber] = useState<number>(note.number);
  const [numberInterval, setNumberInterval] = useState<NodeJS.Timer | null>(
    null
  );

  const volume = useAppSelector((state) => state.app.volume);
  const secondTourActiveNoteId = useAppSelector(
    (state) => state.secondTour.secondTourActiveNoteId
  );
  const secondTourInterval = useAppSelector(
    (state) => state.secondTour.secondTourInterval
  );
  const stopAllMusic = useAppSelector((state) => state.app.stopAllMusic);
  const nextNoteNumbers = useAppSelector(
    (state) => state.secondTour.nextNoteNumbers
  );
  const stopAllNoteIntervals = useAppSelector(
    (state) => state.secondTour.stopAllNoteIntervals
  );
  const secondTourActiveCategoryId = useAppSelector(
    (state) => state.secondTour.secondTourActiveCategoryId
  );
  const numberIncrementSpeed = useAppSelector(
    (state) => state.secondTour.numberIncrementSpeed
  );
  const secondTour = useAppSelector((state) => state.secondTour.secondTour);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const dispatch = useAppDispatch();

  const { height } = useWindowDimensions();

  const audioRef = useRef<ReactAudioPlayer>(null);
  const originalAudioRef = useRef<ReactAudioPlayer>(null);

  useEffect(() => {
    if (stopAllMusic) {
      if (secondTourActiveNoteId !== note.id) {
        pauseMusic();
        pauseOriginalMusic();
        dispatch(setStopAllMusicAction(false));
      }
    }
  }, [stopAllMusic]);

  useEffect(() => {
    if (nextNoteNumbers[categoryIndex] !== undefined) {
      const isActiveCategory =
        secondTour.categories[categoryIndex].id === secondTourActiveCategoryId;

      if (numberInterval && !isActiveCategory) {
        clearInterval(numberInterval);
        setNumberInterval(null);
        const nexNoteNumber = {
          ...nextNoteNumbers[categoryIndex],
          number: tempNumber,
          categoryIndex,
        };

        dispatch(editNextNoteNumberAction(nexNoteNumber));
      } else if (
        nextNoteNumbers[categoryIndex].lastNoteId !== note.id &&
        numberInterval
      ) {
        clearInterval(numberInterval);
        setNumberInterval(null);
        const nexNoteNumber = {
          ...nextNoteNumbers[categoryIndex],
          number: tempNumber,
          categoryIndex,
        };

        dispatch(editNextNoteNumberAction(nexNoteNumber));
      }
    }
  }, [stopAllNoteIntervals]);

  useEffect(() => {
    if (
      nextNoteNumbers[categoryIndex] !== undefined &&
      nextNoteNumbers[categoryIndex].lastNoteId === note.id
    ) {
      setTempNumber(nextNoteNumbers[categoryIndex].number);
    }
  }, [nextNoteNumbers]);

  const clickHandler = (e: any) => {
    if (secondTourInterval) {
      // При первом нажатии на первую ноту
      if (noteIndex > 0) return;
      if (!note.backingTrack) {
        dispatch(setErrorAction('Минусовка песни не найдена.'));
        return;
      }

      clearInterval(secondTourInterval);
      dispatch(setSecondTourIntervalAction(null));

      const nexNoteNumber: INextNoteNumber = {
        lastNoteId: note.id,
        nextNoteId: getNextNoteId(note.id),
        number: tempNumber,
        categoryIndex,
      };
      dispatch(editNextNoteNumberAction(nexNoteNumber));

      secondTourStartNumberInterval();
    } else {
      if (e.target.tagName === 'ARTICLE' && active) {
        if (!note.original) {
          dispatch(setErrorAction('Песня не найдена.'));
          return;
        }

        if (numberInterval) {
          secondTourStopNumberInterval(numberInterval);
        }

        if (originalMusicIsPlaying()) {
          pauseOriginalMusic();
          dispatch(setSecondTourActiveCategoryIdAction(0));
        } else {
          playOriginalMusic();
          dispatch(setSecondTourActiveNoteIdAction(note.id));
          dispatch(setSecondTourActiveCategoryIdAction(category.id));
          dispatch(setStopAllMusicAction(true));
          dispatch(stopAllNoteIntervalsAction());
        }
      } else {
        if (!note.backingTrack) {
          dispatch(setErrorAction('Минусовка песни не найдена.'));
          return;
        }

        let nextNoteId;
        dispatch(stopAllNoteIntervalsAction());
        if (nextNoteNumbers[categoryIndex] !== undefined) {
          //console.log('nextNoteNumbers не undefined');
          nextNoteId = nextNoteNumbers[categoryIndex].nextNoteId;
        } else {
          //console.log('nextNoteNumbers undefined');

          if (noteIndex === 0) {
            const nexNoteNumber: INextNoteNumber = {
              lastNoteId: note.id,
              nextNoteId: getNextNoteId(note.id),
              number: tempNumber,
              categoryIndex,
            };
            dispatch(editNextNoteNumberAction(nexNoteNumber));

            secondTourStartNumberInterval();
            return;
          }
        }

        if (nextNoteId === note.id) {
          //console.log('Нажатие на следующую ноту');
          // При нажатии на следующую ноту
          setTempNumber(nextNoteNumbers[categoryIndex].number);

          const nexNoteNumber: INextNoteNumber = {
            lastNoteId: note.id,
            nextNoteId: getNextNoteId(note.id),
            number: nextNoteNumbers[categoryIndex].number,
            categoryIndex,
          };
          dispatch(editNextNoteNumberAction(nexNoteNumber));

          secondTourStartNumberInterval();
        } else {
          if (numberInterval) {
            //console.log('Остановка текущей ноты');
            // Для остановки текущей ноты
            secondTourStopNumberInterval(numberInterval);
          } else if (
            nextNoteNumbers[categoryIndex] !== undefined &&
            nextNoteNumbers[categoryIndex].lastNoteId === note.id
          ) {
            //console.log('Запуск текущей ноты');
            // Для запуска текущей ноты
            secondTourStartNumberInterval();
          }
        }
      }
    }
  };

  const playMusic = () => {
    audioRef.current?.audioEl.current?.play();
  };

  const pauseMusic = () => {
    audioRef.current?.audioEl.current?.pause();
  };

  const playOriginalMusic = () => {
    originalAudioRef.current?.audioEl.current?.play();
  };

  const pauseOriginalMusic = () => {
    originalAudioRef.current?.audioEl.current?.pause();
  };

  const originalMusicIsPlaying = (): boolean => {
    return !originalAudioRef.current?.audioEl.current?.paused;
  };

  const secondTourStartNumberInterval = () => {
    setActive(true);
    pauseOriginalMusic();
    playMusic();

    dispatch(setSecondTourActiveNoteIdAction(note.id));
    dispatch(setSecondTourActiveCategoryIdAction(category.id));
    dispatch(setStopAllMusicAction(true));

    const interval = setInterval(() => {
      setTempNumber((prevState) => prevState + 1);
    }, numberIncrementSpeed);

    setNumberInterval(interval);
  };

  const secondTourStopNumberInterval = (numberInterval: NodeJS.Timer) => {
    pauseMusic();
    clearInterval(numberInterval);
    setNumberInterval(null);

    const nexNoteNumber: INextNoteNumber = {
      lastNoteId: note.id,
      nextNoteId: getNextNoteId(note.id),
      number: tempNumber,
      categoryIndex,
    };
    dispatch(editNextNoteNumberAction(nexNoteNumber));
    dispatch(setSecondTourActiveCategoryIdAction(0));
  };

  const getNextNoteId = (nodeId: number) => {
    const lastNoteIdValues = ('' + nodeId).split('').map(Number);
    lastNoteIdValues[1]++;
    return Number(lastNoteIdValues.join(''));
  };

  return (
    <div className={styles.image_container} onClick={(e) => clickHandler(e)}>
      <ReactAudioPlayer
        src={
          note.backingTrack ? assetsPath + '\\' + note.backingTrack.path : ''
        }
        controls={false}
        ref={audioRef}
        volume={volume}
      />
      <ReactAudioPlayer
        src={note.original ? assetsPath + '\\' + note.original.path : ''}
        controls={false}
        ref={originalAudioRef}
        volume={volume}
      />
      <span
        className={styles.text}
        style={{
          fontSize: `${height / 15}px`,
          marginTop: `${height / 15}px`,
        }}
      >
        {active && tempNumber}
      </span>
      <article className={styles.original_music} />
      <img
        className={styles.image}
        src={secondTourActiveNoteId === note.id ? NOTE_ON : NOTE_OFF}
      />
    </div>
  );
};

export default SecondTourNote;
