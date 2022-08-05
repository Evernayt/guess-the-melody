import { FC, useEffect, useRef, useState } from 'react';
import { NOTE_OFF, NOTE_ON } from 'constants/images';
import ReactAudioPlayer from 'react-audio-player';
import styles from './FirstTourNote.module.css';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useWindowDimensions } from 'hooks';
import { setErrorAction, setStopAllMusicAction } from 'store/reducers/AppSlice';
import { INote } from 'models/INote';
import { ICategory } from 'models/ICategory';
import {
  setFirstTourActiveCategoryIdAction,
  setFirstTourActiveNoteIdAction,
} from 'store/reducers/FirtsTourSlice';
import { openQuestionModalAction } from 'store/reducers/ModalSlice';

interface FirstTourNoteProps {
  note: INote;
  category: ICategory;
}

const FirstTourNote: FC<FirstTourNoteProps> = ({ note, category }) => {
  const [active, setActive] = useState<boolean>(false);
  const [activeDoubleSharp, setActiveDoubleSharp] = useState<boolean>(false);
  const [doubleSharpInterval, setDoubleSharpInterval] =
    useState<NodeJS.Timer | null>(null);

  const volume = useAppSelector((state) => state.app.volume);
  const firstTourActiveNoteId = useAppSelector(
    (state) => state.firstTour.firstTourActiveNoteId
  );
  const stopAllMusic = useAppSelector((state) => state.app.stopAllMusic);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const dispatch = useAppDispatch();

  const { height } = useWindowDimensions();

  const audioRef = useRef<ReactAudioPlayer>(null);
  const originalAudioRef = useRef<ReactAudioPlayer>(null);

  useEffect(() => {
    if (stopAllMusic) {
      if (firstTourActiveNoteId !== note.id) {
        pauseMusic();
        pauseOriginalMusic();
        dispatch(setStopAllMusicAction(false));
      }
    }
  }, [stopAllMusic]);

  const clickHandler = (e: any) => {
    dispatch(setFirstTourActiveNoteIdAction(note.id));
    dispatch(setFirstTourActiveCategoryIdAction(category.id));
    dispatch(setStopAllMusicAction(true));

    if (e.target.tagName === 'ARTICLE' && active) {
      pauseMusic();

      if (!note.original) {
        dispatch(setErrorAction('Песня не найдена.'));
        return;
      }

      if (originalMusicIsPlaying()) {
        pauseOriginalMusic();
        dispatch(setFirstTourActiveCategoryIdAction(0));
      } else {
        if (!activeDoubleSharp) {
          startDoubleSharp();
        }
        playOriginalMusic();
      }
    } else {
      if (doubleSharpInterval) {
        openQuestion();
        return;
      }

      if (!note.backingTrack) {
        dispatch(setErrorAction('Минусовка песни не найдена.'));
        return;
      }

      setActive(true);

      pauseOriginalMusic();

      if (musicIsPlaying()) {
        pauseMusic();
        if (!activeDoubleSharp) {
          startDoubleSharp();
        }
        dispatch(setFirstTourActiveCategoryIdAction(0));
      } else {
        playMusic();
      }
    }
  };

  const playMusic = () => {
    audioRef.current?.audioEl.current?.play();
  };

  const pauseMusic = () => {
    audioRef.current?.audioEl.current?.pause();
  };

  const musicIsPlaying = (): boolean => {
    return !audioRef.current?.audioEl.current?.paused;
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

  const startDoubleSharp = () => {
    if (note.doubleSharp) {
      setActiveDoubleSharp(true);
      const interval = setInterval(() => {
        setActiveDoubleSharp((prevState) => !prevState);
      }, 500);

      setDoubleSharpInterval(interval);
    }
  };

  const openQuestion = () => {
    if (doubleSharpInterval) {
      clearInterval(doubleSharpInterval);
      setDoubleSharpInterval(null);
      setActiveDoubleSharp(false);
    }

    dispatch(openQuestionModalAction(note.doubleSharp));
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
        {active && activeDoubleSharp ? '##' : active && note.number}
      </span>
      <article className={styles.original_music} />
      <img
        className={styles.image}
        src={firstTourActiveNoteId === note.id ? NOTE_ON : NOTE_OFF}
      />
    </div>
  );
};

export default FirstTourNote;
