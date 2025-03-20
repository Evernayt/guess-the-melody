import { HStack, Text } from '@chakra-ui/react';
import { IconMusic } from '@tabler/icons-react';
import { INITIAL_PLAYING_NOTE } from 'constants/initialStates';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useRef } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { MusicVariants } from 'types/IMusic';

enum NoteVariants {
  backingTrack = 'минусовка',
  original = 'оригинал',
}

const INITIAL_LAST_TIMES = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const NotePlayer = () => {
  const activeTour = useAppSelector((state) => state.app.activeTour);
  const playingNote = useAppSelector((state) => state.app.playingNote);
  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const audioRef = useRef<HTMLAudioElement>(null);
  // index = noteId
  const lastTimes = useRef<number[]>([...INITIAL_LAST_TIMES]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    lastTimes.current = [...INITIAL_LAST_TIMES];
    dispatch(appActions.setPlayingNote(INITIAL_PLAYING_NOTE));
  }, [activeTour]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (playingNote.musicVariant === MusicVariants.original) {
        audioRef.current.currentTime = playingNote.originalStartTime;
      } else {
        audioRef.current.currentTime = lastTimes.current[playingNote.noteId];
      }

      if (playingNote.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playingNote]);

  const timeUpdateHandler = () => {
    if (audioRef.current) {
      lastTimes.current[playingNote.noteId] = audioRef.current.currentTime;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={
          playingNote.relativePath !== ''
            ? `${assetsPath}\\${playingNote.relativePath}`
            : ''
        }
        style={{ display: 'none' }}
        onTimeUpdate={timeUpdateHandler}
      />
      {playingNote.isPlaying && (
        <HStack
          className="animate"
          color="gray.400"
          ml="auto"
          userSelect="none"
        >
          <IconMusic size={20} />
          <Text fontSize="sm">{`Играет ${NoteVariants[playingNote.musicVariant]} песни`}</Text>
        </HStack>
      )}
    </>
  );
};

export default NotePlayer;
