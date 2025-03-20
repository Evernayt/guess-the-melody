import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Tooltip,
} from '@chakra-ui/react';
import { OCTAVES } from 'constants/octaves';
import { sleep } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect, useRef, useState } from 'react';
import { tour3Actions } from 'store/reducers/Tour3Slice';
import { IPianoNote, PianoKeyColors } from 'types/IMusicTheme';
import PianoOctave from './piano-octave/PianoOctave';
import {
  IconPencil,
  IconPencilCheck,
  IconPlayerPlayFilled,
  IconPlayerRecord,
  IconPlayerStopFilled,
} from '@tabler/icons-react';
import { MIN_PIANO_NOTES } from 'constants/initialStates';
import { setMaxPianoNotes } from 'helpers/localStorage';
import { appActions } from 'store/reducers/AppSlice';
import styles from './Piano.module.scss';

interface PianoProps {
  pianoNotes: IPianoNote[];
  setPianoNotes: (
    state: IPianoNote[] | ((state: IPianoNote[]) => IPianoNote[]),
  ) => void;
}

const Piano: FC<PianoProps> = ({ pianoNotes, setPianoNotes }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>('');
  const [playingNote, setPlayingNote] = useState<IPianoNote>();

  const maxPianoNotes = useAppSelector((state) => state.app.maxPianoNotes);

  const isPlayingRef = useRef<boolean>(isPlaying);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setNotesText('');
    pianoNotes.forEach(({ delay, color, key }) => {
      setNotesText((prevState) => `${prevState}[${delay}-${color}-${key}] `);
    });

    if (pianoNotes.length === maxPianoNotes) {
      setIsRecord(false);
    }
  }, [pianoNotes]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const editNotes = () => {
    setIsEditMode(false);
    setPianoNotes([]);
    if (notesText === '') return;

    const notesArr = notesText.trimEnd().split(' ');
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

  const playNotes = async () => {
    setIsPlaying(true);
    try {
      for (let i = 0; i < pianoNotes.length; i++) {
        await sleep(pianoNotes[i].delay, isPlayingRef);
        setPlayingNote(pianoNotes[i]);
      }
    } catch (error) {
    } finally {
      setIsPlaying(false);
    }
  };

  const record = () => {
    setIsRecord((prevState) => !prevState);
    dispatch(tour3Actions.setLastPlayingTime(0));
  };

  const deleteRecord = () => {
    setPianoNotes([]);
    setNotesText('');
  };

  const maxPianoNotesChange = (maxPianoNotes: number) => {
    dispatch(appActions.setMaxPianoNotes(maxPianoNotes));
    setMaxPianoNotes(maxPianoNotes);
  };

  return (
    <Box p={4} borderRadius={12} bgColor="#101010">
      <HStack>
        <Tooltip
          label="Максимальное количество нот, которое можно записать"
          textAlign="center"
          hasArrow
          w="250px"
          placement="right"
          openDelay={800}
        >
          <InputGroup maxW="130px">
            <InputLeftAddon>Макс. нот</InputLeftAddon>
            <NumberInput
              min={MIN_PIANO_NOTES}
              max={99}
              color="white"
              defaultValue={maxPianoNotes}
              onChange={(_, number) =>
                number >= MIN_PIANO_NOTES && maxPianoNotesChange(number)
              }
            >
              <NumberInputField p="0 12px" />
            </NumberInput>
          </InputGroup>
        </Tooltip>
        <Input
          value={notesText}
          disabled={!isEditMode}
          color="white"
          fontSize="xs"
          w="100%"
          onChange={(e) => setNotesText(e.target.value)}
        />
        <HStack>
          {pianoNotes.length >= maxPianoNotes ? (
            <Button onClick={deleteRecord}>Удалить запись</Button>
          ) : (
            <Button
              leftIcon={
                <IconPlayerRecord
                  className={isRecord ? styles.rec : ''}
                  size={20}
                  color="#E53E3E"
                />
              }
              onClick={record}
            >
              {isRecord ? 'Стоп' : 'Запись'}
            </Button>
          )}
          <IconButton
            icon={
              isEditMode ? (
                <IconPencilCheck size={20} />
              ) : (
                <IconPencil size={20} />
              )
            }
            aria-label="edit"
            onClick={isEditMode ? editNotes : () => setIsEditMode(true)}
          />
          <IconButton
            icon={
              isPlaying ? (
                <IconPlayerStopFilled size={20} />
              ) : (
                <IconPlayerPlayFilled size={20} />
              )
            }
            aria-label="play"
            disabled={pianoNotes.length < maxPianoNotes || isEditMode}
            onClick={isPlaying ? () => setIsPlaying(false) : playNotes}
          />
        </HStack>
      </HStack>
      <Flex mt={4} position="relative">
        {OCTAVES.map((octave) => (
          <PianoOctave
            pianoOctave={octave}
            setPianoNotes={setPianoNotes}
            disabled={isEditMode}
            playingNote={playingNote}
            isRecord={isRecord}
            maxNotes={maxPianoNotes}
            key={octave.id}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default Piano;
