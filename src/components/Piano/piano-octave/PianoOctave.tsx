import { useKeyPress } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IPianoNote, PianoKeyColors } from 'types/IMusicTheme';
import { IPianoOctave } from 'types/IPianoOctave';
import { FC, useEffect, useRef, useState } from 'react';
import { tour3Actions } from 'store/reducers/Tour3Slice';
import { DarkMode, Kbd, Text } from '@chakra-ui/react';
import styles from './PianoOctave.module.scss';

interface PianoOctaveProps {
  pianoOctave: IPianoOctave;
  setPianoNotes: (
    state: IPianoNote[] | ((state: IPianoNote[]) => IPianoNote[]),
  ) => void;
  playingNote?: IPianoNote;
  disabled: boolean;
  isRecord: boolean;
  maxNotes: number;
}

const PianoOctave: FC<PianoOctaveProps> = ({
  pianoOctave,
  setPianoNotes,
  playingNote,
  disabled,
  isRecord,
  maxNotes,
}) => {
  const [activeBlackKey, setActiveBlackKey] = useState<boolean>(false);
  const [activeWhiteKey, setActiveWhiteKey] = useState<boolean>(false);

  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);
  const lastPlayingTime = useAppSelector(
    (state) => state.tour3.lastPlayingTime,
  );

  const blackKeyAudioRef = useRef<HTMLAudioElement>();
  const whiteKeyAudioRef = useRef<HTMLAudioElement>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (playingNote !== undefined && playingNote.key !== undefined) {
      if (playingNote.key === pianoOctave.blackKey?.key) {
        blackKeyPressHandler();
      } else if (playingNote.key === pianoOctave.whiteKey.key) {
        whiteKeyPressHandler();
      }
    }
  }, [playingNote]);

  useEffect(() => {
    blackKeysPressRerender?.rerender();
    whiteKeysPressRerender.rerender();
  }, [disabled, isRecord, lastPlayingTime]);

  const blackKeyPressHandler = () => {
    if (disabled) return;
    setActiveBlackKey(true);
    playBlackKeySound();
    setTimeout(() => setActiveBlackKey(false), 100);
  };

  const whiteKeyPressHandler = () => {
    if (disabled) return;
    setActiveWhiteKey(true);
    playWhiteKeySound();
    setTimeout(() => setActiveWhiteKey(false), 100);
  };

  const playBlackKeySound = () => {
    if (isRecord) {
      const playingTime = new Date().getTime();
      const delay = lastPlayingTime === 0 ? 250 : playingTime - lastPlayingTime;
      dispatch(tour3Actions.setLastPlayingTime(playingTime));

      setPianoNotes((prevState) =>
        prevState.length < maxNotes
          ? [
              ...prevState,
              {
                key: pianoOctave.blackKey!.key,
                color: PianoKeyColors.black,
                delay,
              },
            ]
          : prevState,
      );
    }

    blackKeyAudioRef.current = new Audio(
      `${assetsPath}\\${pianoOctave.blackKey?.sound}`,
    );
    blackKeyAudioRef.current.volume = volume;
    blackKeyAudioRef.current.play();
  };

  const playWhiteKeySound = () => {
    if (isRecord) {
      const playingTime = new Date().getTime();
      const delay = lastPlayingTime === 0 ? 250 : playingTime - lastPlayingTime;
      dispatch(tour3Actions.setLastPlayingTime(playingTime));

      setPianoNotes((prevState) =>
        prevState.length < maxNotes
          ? [
              ...prevState,
              {
                key: pianoOctave.whiteKey.key,
                color: PianoKeyColors.white,
                delay,
              },
            ]
          : prevState,
      );
    }

    whiteKeyAudioRef.current = new Audio(
      `${assetsPath}\\${pianoOctave.whiteKey?.sound}`,
    );
    whiteKeyAudioRef.current.volume = volume;
    whiteKeyAudioRef.current.play();
  };

  const blackKeysPressRerender =
    pianoOctave.blackKey &&
    useKeyPress(pianoOctave.blackKey.keyboard_keys, blackKeyPressHandler);

  const whiteKeysPressRerender = useKeyPress(
    pianoOctave.whiteKey.keyboard_keys,
    whiteKeyPressHandler,
  );

  const activeBlackKeyStyle = `${styles.key} ${styles.black_key} ${styles.black_key_active}`;
  const blackKeyStyle = `${styles.key} ${styles.black_key}`;
  const activeWhiteKeyStyle = `${styles.key} ${styles.white_key} ${styles.white_key_active}`;
  const whiteKeyStyle = `${styles.key} ${styles.white_key}`;

  return (
    <div className={styles.container}>
      {pianoOctave.blackKey && (
        <div
          className={activeBlackKey ? activeBlackKeyStyle : blackKeyStyle}
          tabIndex={0}
          onClick={playBlackKeySound}
        >
          {!disabled && (
            <DarkMode>
              <Kbd>{pianoOctave.blackKey.keyboard_keys[0]}</Kbd>
            </DarkMode>
          )}
          <Text fontSize="xs">{pianoOctave.blackKey.key}</Text>
        </div>
      )}
      <div
        className={activeWhiteKey ? activeWhiteKeyStyle : whiteKeyStyle}
        tabIndex={0}
        onClick={playWhiteKeySound}
      >
        {!disabled && <Kbd>{pianoOctave.whiteKey.keyboard_keys[0]}</Kbd>}
        <Text fontSize="xs">{pianoOctave.whiteKey.key}</Text>
      </div>
    </div>
  );
};

export default PianoOctave;
