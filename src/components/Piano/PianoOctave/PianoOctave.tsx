import { useKeyPress, useWindowDimensions } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IPianoNote, PianoKeyColors } from 'models/IMusicTheme';
import { IPianoOctave } from 'models/IPianoOctave';
import { FC, useEffect, useRef, useState } from 'react';
import { setLastPlayingTimeAction } from 'store/reducers/ThirdTourSlice';
import styles from './PianoOctave.module.css';

interface PianoOctaveProps {
  pianoOctave: IPianoOctave;
  setPianoNotes: (
    state: IPianoNote[] | ((state: IPianoNote[]) => IPianoNote[])
  ) => void;
  playingNote?: IPianoNote;
  disabled: boolean;
  isRecord: boolean;
}

const PianoOctave: FC<PianoOctaveProps> = ({
  pianoOctave,
  setPianoNotes,
  playingNote,
  disabled,
  isRecord,
}) => {
  const [activeBlackKey, setActiveBlackKey] = useState<boolean>(false);
  const [activeWhiteKey, setActiveWhiteKey] = useState<boolean>(false);

  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);
  const lastPlayingTime = useAppSelector(
    (state) => state.thirdTour.lastPlayingTime
  );

  const blackKeyAudioRef = useRef<HTMLAudioElement>();
  const whiteKeyAudioRef = useRef<HTMLAudioElement>();

  const { width } = useWindowDimensions();

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
      dispatch(setLastPlayingTimeAction(playingTime));

      setPianoNotes((prevState) =>
        prevState.length < 7
          ? [
              ...prevState,
              {
                key: pianoOctave.blackKey!.key,
                color: PianoKeyColors.black,
                delay,
              },
            ]
          : prevState
      );
    }

    blackKeyAudioRef.current = new Audio(
      assetsPath + '\\' + pianoOctave.blackKey?.sound
    );
    blackKeyAudioRef.current.volume = volume;
    blackKeyAudioRef.current.play();
  };

  const playWhiteKeySound = () => {
    if (isRecord) {
      const playingTime = new Date().getTime();
      const delay = lastPlayingTime === 0 ? 250 : playingTime - lastPlayingTime;
      dispatch(setLastPlayingTimeAction(playingTime));

      setPianoNotes((prevState) =>
        prevState.length < 7
          ? [
              ...prevState,
              {
                key: pianoOctave.whiteKey.key,
                color: PianoKeyColors.white,
                delay,
              },
            ]
          : prevState
      );
    }

    whiteKeyAudioRef.current = new Audio(
      assetsPath + '\\' + pianoOctave.whiteKey?.sound
    );
    whiteKeyAudioRef.current.volume = volume;
    whiteKeyAudioRef.current.play();
  };

  const blackKeysPressRerender =
    pianoOctave.blackKey &&
    useKeyPress(pianoOctave.blackKey.keyboard_keys, blackKeyPressHandler);

  const whiteKeysPressRerender = useKeyPress(
    pianoOctave.whiteKey.keyboard_keys,
    whiteKeyPressHandler
  );

  const whiteKeyStyle = {
    width: `${width / 30}px`,
    fontSize: `${width / 120}px`,
  };
  const blackKeyStyle = {
    width: `${width / 50}px`,
    fontSize: `${width / 160}px`,
  };

  return (
    <div style={{ position: 'relative' }}>
      {pianoOctave.blackKey && (
        <div
          className={
            activeBlackKey
              ? [styles.key, styles.black_key, styles.black_key_active].join(
                  ' '
                )
              : [styles.key, styles.black_key].join(' ')
          }
          style={blackKeyStyle}
          tabIndex={0}
          onClick={playBlackKeySound}
        >
          {!disabled && <div>{pianoOctave.blackKey.keyboard_keys[0]}</div>}
          <div>{pianoOctave.blackKey.key}</div>
        </div>
      )}
      <div
        className={
          activeWhiteKey
            ? [styles.key, styles.white_key, styles.white_key_active].join(' ')
            : [styles.key, styles.white_key].join(' ')
        }
        style={whiteKeyStyle}
        tabIndex={0}
        onClick={playWhiteKeySound}
      >
        {!disabled && <div>{pianoOctave.whiteKey.keyboard_keys[0]}</div>}
        <div>{pianoOctave.whiteKey.key}</div>
      </div>
    </div>
  );
};

export default PianoOctave;
