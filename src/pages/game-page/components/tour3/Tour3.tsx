import {
  Button,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { MIN_PIANO_NOTES } from 'constants/initialStates';
import { OCTAVES } from 'constants/octaves';
import { sleep } from 'helpers';
import { useAppSelector } from 'hooks/redux';
import { useEffect, useRef, useState } from 'react';
import { IMusicTheme, IPianoNote, PianoKeyColors } from 'types/IMusicTheme';

interface IPreparedNoteSound {
  pianoNote: IPianoNote;
  sound: string;
}

const Tour3 = () => {
  const tour3 = useAppSelector((state) => state.tour3.tour3);

  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(-1);
  const [activeMusicThemeIndex, setActiveMusicThemeIndex] = useState<number>(0);
  const [musicTheme, setMusicTheme] = useState<IMusicTheme>(
    tour3.musicThemes[activeMusicThemeIndex],
  );
  const [preparedNoteSounds, setPreparedNoteSounds] = useState<
    IPreparedNoteSound[]
  >([]);

  const assetsPath = useAppSelector((state) => state.app.assetsPath);
  const volume = useAppSelector((state) => state.app.volume);

  const isPlayingRef = useRef(true);

  const toast = useToast();

  useEffect(() => {
    prepareNoteSounds(tour3.musicThemes[0].pianoNotes);
  }, []);

  const showError = (description: string) => {
    toast({
      description,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const prevMusicTheme = () => {
    setActiveNoteIndex(-1);
    const prevIndex = activeMusicThemeIndex - 1;
    setActiveMusicThemeIndex(prevIndex);
    setMusicTheme(tour3.musicThemes[prevIndex]);
    prepareNoteSounds(tour3.musicThemes[prevIndex].pianoNotes);
  };

  const nextMusicTheme = () => {
    const nextIndex = activeMusicThemeIndex + 1;
    if (tour3.musicThemes[nextIndex].imagePath === '') {
      showError('Изображение вопроса не найдено');
    } else {
      setActiveNoteIndex(-1);
      setActiveMusicThemeIndex(nextIndex);
      setMusicTheme(tour3.musicThemes[nextIndex]);
      prepareNoteSounds(tour3.musicThemes[nextIndex].pianoNotes);
    }
  };

  const prepareNoteSounds = (pianoNotes: IPianoNote[]) => {
    const tempNoteSounds: IPreparedNoteSound[] = [];

    pianoNotes.forEach((pianoNote) => {
      let sound = '';

      if (pianoNote.color === PianoKeyColors.black) {
        const result = OCTAVES.find(
          (octave) => octave.blackKey?.key === pianoNote.key,
        );
        if (result?.blackKey?.sound !== undefined) {
          sound = `${assetsPath}\\${result.blackKey.sound}`;
        }
      } else {
        const result = OCTAVES.find(
          (octave) => octave.whiteKey.key === pianoNote.key,
        );
        if (result?.whiteKey.sound !== undefined) {
          sound = `${assetsPath}\\${result.whiteKey.sound}`;
        }
      }

      tempNoteSounds.push({ pianoNote, sound });
    });

    setPreparedNoteSounds(tempNoteSounds);
  };

  const playNotes = async (noteIndex: number) => {
    setActiveNoteIndex(noteIndex);

    try {
      for (let i = 0; i < noteIndex + 1; i++) {
        await sleep(preparedNoteSounds[i].pianoNote.delay, isPlayingRef);
        const audio = new Audio(preparedNoteSounds[i].sound);
        audio.volume = volume;
        audio.play();
      }
    } catch (error) {}
  };

  const MAX_PIANO_NOTES = musicTheme?.pianoNotes.length;

  return (
    <VStack>
      <Image
        src={`${assetsPath}\\${musicTheme.imagePath}`}
        h="calc(100vh - 230px)"
        objectFit="contain"
        borderRadius={8}
      />
      <HStack>
        {musicTheme?.pianoNotes.map((pianoNote, index) => {
          if (index >= 2 && index < MIN_PIANO_NOTES) {
            return (
              <Button
                colorScheme={activeNoteIndex === index ? 'green' : 'gray'}
                size="lg"
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
        {MAX_PIANO_NOTES !== 0 && (
          <Button
            colorScheme={
              activeNoteIndex === MAX_PIANO_NOTES - 1 ? 'green' : 'gray'
            }
            size="lg"
            onClick={() => playNotes(MAX_PIANO_NOTES - 1)}
          >
            Все ноты
          </Button>
        )}
      </HStack>
      <HStack>
        <Button
          leftIcon={<IconArrowLeft size={20} />}
          size="lg"
          disabled={activeMusicThemeIndex === 0}
          onClick={prevMusicTheme}
        >
          Предыдущий вопрос
        </Button>
        <Button
          rightIcon={<IconArrowRight size={20} />}
          colorScheme="purple"
          size="lg"
          disabled={activeMusicThemeIndex === 4}
          onClick={nextMusicTheme}
        >
          Следующий вопрос
        </Button>
      </HStack>
      <Text
        color="gray.400"
        fontSize="sm"
      >{`Вопрос: ${activeMusicThemeIndex + 1}/5`}</Text>
    </VStack>
  );
};

export default Tour3;
