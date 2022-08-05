import { Button } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { octaves } from 'constants/octaves';
import { sleep } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IMusicTheme, IPianoNote, PianoKeyColors } from 'models/IMusicTheme';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { setErrorAction } from 'store/reducers/AppSlice';
import styles from './ThirdTour.module.css';

const bigButtonStyle: CSSProperties = {
  height: '50px',
  padding: '0 40px',
  fontSize: '16px',
  fontWeight: 'bold',
};

interface IPreparedNoteSound {
  pianoNote: IPianoNote;
  sound: string;
}

const ThirdTour = () => {
  const thirdTour = useAppSelector((state) => state.thirdTour.thirdTour);

  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(-1);
  const [activeMusicThemeIndex, setActiveMusicThemeIndex] = useState<number>(0);
  const [musicTheme, setMusicTheme] = useState<IMusicTheme>(
    thirdTour.musicThemes[activeMusicThemeIndex]
  );
  const [preparedNoteSounds, setPreparedNoteSounds] = useState<
    IPreparedNoteSound[]
  >([]);

  const assetsPath = useAppSelector((state) => state.app.assetsPath);
  const volume = useAppSelector((state) => state.app.volume);

  const isPlayingRef = useRef(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    prepareNoteSounds(thirdTour.musicThemes[0].pianoNotes);
  }, []);

  const prevMusicTheme = () => {
    setActiveNoteIndex(-1);
    const prevIndex = activeMusicThemeIndex - 1;
    setActiveMusicThemeIndex(prevIndex);
    setMusicTheme(thirdTour.musicThemes[prevIndex]);
    prepareNoteSounds(thirdTour.musicThemes[prevIndex].pianoNotes);
  };

  const nextMusicTheme = () => {
    const nextIndex = activeMusicThemeIndex + 1;
    if (thirdTour.musicThemes[nextIndex].image === '') {
      dispatch(setErrorAction('Изображение вопроса не найдено'));
    } else {
      setActiveNoteIndex(-1);
      setActiveMusicThemeIndex(nextIndex);
      setMusicTheme(thirdTour.musicThemes[nextIndex]);
      prepareNoteSounds(thirdTour.musicThemes[nextIndex].pianoNotes);
    }
  };

  const prepareNoteSounds = (pianoNotes: IPianoNote[]) => {
    const tempNoteSounds: IPreparedNoteSound[] = [];

    for (let index = 0; index < pianoNotes.length; index++) {
      const color = pianoNotes[index].color;
      const key = pianoNotes[index].key;
      let sound = '';

      if (color === PianoKeyColors.black) {
        const result = octaves.find((octave) => octave.blackKey?.key === key);
        if (result?.blackKey?.sound !== undefined) {
          sound = assetsPath + '\\' + result.blackKey.sound;
        }
      } else {
        const result = octaves.find((octave) => octave.whiteKey.key === key);
        if (result?.whiteKey.sound !== undefined) {
          sound = assetsPath + '\\' + result.whiteKey.sound;
        }
      }

      tempNoteSounds.push({ pianoNote: pianoNotes[index], sound });
    }

    setPreparedNoteSounds(tempNoteSounds);
  };

  const playNotes = (noteIndex: number) => {
    setActiveNoteIndex(noteIndex);
    sleep(preparedNoteSounds[0].pianoNote.delay, isPlayingRef)
      .then(() => {
        const audio = new Audio(preparedNoteSounds[0].sound);
        audio.volume = volume;
        audio.play();
        sleep(preparedNoteSounds[1].pianoNote.delay, isPlayingRef)
          .then(() => {
            const audio = new Audio(preparedNoteSounds[1].sound);
            audio.volume = volume;
            audio.play();
            sleep(preparedNoteSounds[2].pianoNote.delay, isPlayingRef)
              .then(() => {
                const audio = new Audio(preparedNoteSounds[2].sound);
                audio.volume = volume;
                audio.play();
                if (noteIndex === 2) return;
                sleep(preparedNoteSounds[3].pianoNote.delay, isPlayingRef)
                  .then(() => {
                    const audio = new Audio(preparedNoteSounds[3].sound);
                    audio.volume = volume;
                    audio.play();
                    if (noteIndex === 3) return;
                    sleep(preparedNoteSounds[4].pianoNote.delay, isPlayingRef)
                      .then(() => {
                        const audio = new Audio(preparedNoteSounds[4].sound);
                        audio.volume = volume;
                        audio.play();
                        if (noteIndex === 4) return;
                        sleep(
                          preparedNoteSounds[5].pianoNote.delay,
                          isPlayingRef
                        )
                          .then(() => {
                            const audio = new Audio(
                              preparedNoteSounds[5].sound
                            );
                            audio.volume = volume;
                            audio.play();
                            if (noteIndex === 5) return;
                            sleep(
                              preparedNoteSounds[6].pianoNote.delay,
                              isPlayingRef
                            )
                              .then(() => {
                                const audio = new Audio(
                                  preparedNoteSounds[6].sound
                                );
                                audio.volume = volume;
                                audio.play();
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

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={assetsPath + '\\' + musicTheme.image}
      />
      <div>
        <div className={styles.controls}>
          {musicTheme?.pianoNotes.map((pianoNote, index) => {
            if (index > 1) {
              return (
                <Button
                  variant={
                    activeNoteIndex === index
                      ? ButtonVariants.success
                      : ButtonVariants.default
                  }
                  style={bigButtonStyle}
                  onClick={() => playNotes(index)}
                  key={index + pianoNote.key}
                >
                  {index + 1} {index > 3 ? 'нот' : 'ноты'}
                </Button>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className={styles.controls}>
          <Button
            style={{ ...bigButtonStyle, width: 'max-content' }}
            disabled={activeMusicThemeIndex === 0}
            onClick={prevMusicTheme}
          >
            Предыдущий вопрос
          </Button>
          <Button
            variant={ButtonVariants.primary}
            style={{ ...bigButtonStyle, width: 'max-content' }}
            disabled={activeMusicThemeIndex === 4}
            onClick={nextMusicTheme}
          >
            Следующий вопрос
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThirdTour;
