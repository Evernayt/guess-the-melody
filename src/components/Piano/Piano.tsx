import PianoOctave from './PianoOctave/PianoOctave';
import styles from './Piano.module.css';
import { octaves } from 'constants/octaves';
import Button, { ButtonVariants } from 'components/Button/Button';
import { FC, useEffect, useRef, useState } from 'react';
import Textbox from 'components/Textbox/Textbox';
import { IPianoNote, PianoKeyColors } from 'models/IMusicTheme';
import { sleep } from 'helpers';
import { useAppDispatch } from 'hooks/redux';
import { setLastPlayingTimeAction } from 'store/reducers/ThirdTourSlice';

interface PianoProps {
  pianoNotes: IPianoNote[];
  setPianoNotes: (
    state: IPianoNote[] | ((state: IPianoNote[]) => IPianoNote[])
  ) => void;
}

const Piano: FC<PianoProps> = ({ pianoNotes, setPianoNotes }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>('');
  const [playingNote, setPlayingNote] = useState<IPianoNote>();

  const isPlayingRef = useRef(isPlaying);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setNotesText('');
    for (let index = 0; index < pianoNotes.length; index++) {
      const key = pianoNotes[index].key;
      const color = pianoNotes[index].color;
      const delay = pianoNotes[index].delay;

      setNotesText((prevState) => `${prevState}[${delay}-${color}-${key}]   `);
    }

    if (pianoNotes.length === 7) {
      setIsRecord(false);
      return;
    }
  }, [pianoNotes]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const editNotes = () => {
    setIsEditMode(false);
    setPianoNotes([]);
    if (notesText === '') return;

    const notesArr = notesText.trimEnd().split('   ');
    for (let index = 0; index < notesArr.length; index++) {
      const note = notesArr[index].replace(/\[|\]/g, '').split('-');
      setPianoNotes((prevState) => [
        ...prevState,
        {
          key: note[2],
          color:
            note[1] === PianoKeyColors.black
              ? PianoKeyColors.black
              : PianoKeyColors.white,
          delay: Number(note[0]),
        },
      ]);
    }
  };

  const playNotes = () => {
    setIsPlaying(true);
    sleep(pianoNotes[0].delay, isPlayingRef)
      .then(() => {
        setPlayingNote(pianoNotes[0]);
        sleep(pianoNotes[1].delay, isPlayingRef)
          .then(() => {
            setPlayingNote(pianoNotes[1]);
            sleep(pianoNotes[2].delay, isPlayingRef)
              .then(() => {
                setPlayingNote(pianoNotes[2]);
                sleep(pianoNotes[3].delay, isPlayingRef)
                  .then(() => {
                    setPlayingNote(pianoNotes[3]);
                    sleep(pianoNotes[4].delay, isPlayingRef)
                      .then(() => {
                        setPlayingNote(pianoNotes[4]);
                        sleep(pianoNotes[5].delay, isPlayingRef)
                          .then(() => {
                            setPlayingNote(pianoNotes[5]);
                            sleep(pianoNotes[6].delay, isPlayingRef)
                              .then(() => {
                                setPlayingNote(pianoNotes[6]);
                                setIsPlaying(false);
                              })
                              .catch(() => {});
                          })
                          .catch(() => {});
                      })
                      .catch(() => {});
                  })
                  .catch(() => {});
              })
              .catch(() => {});
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const record = () => {
    setIsRecord((prevState) => !prevState);
    dispatch(setLastPlayingTimeAction(0));
  };

  const deleteRecord = () => {
    setPianoNotes([]);
    setNotesText('');
  };

  return (
    <div>
      <div className={styles.header}>
        <Textbox
          disabled={!isEditMode}
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
        />
        <div className={styles.controls}>
          {pianoNotes.length === 7 ? (
            <Button onClick={deleteRecord}>Удалить запись</Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={record}>
              {isRecord ? 'Стоп' : 'Запись'}
            </Button>
          )}

          <Button onClick={isEditMode ? editNotes : () => setIsEditMode(true)}>
            {isEditMode ? 'Применить' : 'Редактировать'}
          </Button>
          <Button
            variant={ButtonVariants.primary}
            disabled={pianoNotes.length < 7}
            onClick={isPlaying ? () => setIsPlaying(false) : playNotes}
          >
            {isPlaying ? 'Стоп' : 'Старт'}
          </Button>
        </div>
      </div>
      <div className={styles.piano_container}>
        <div className={styles.keys_container}>
          {octaves.map((octave) => (
            <PianoOctave
              pianoOctave={octave}
              setPianoNotes={setPianoNotes}
              disabled={isEditMode}
              playingNote={playingNote}
              isRecord={isRecord}
              key={octave.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
