import {
  Center,
  Flex,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { appActions } from 'store/reducers/AppSlice';

function formatTime(seconds: number) {
  if (Number.isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const MusicPlayer = () => {
  const [time, setTime] = useState<number>(0);

  const playingMusic = useAppSelector((state) => state.app.playingMusic);
  const volume = useAppSelector((state) => state.app.volume);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const audioRef = useRef<HTMLAudioElement>(null);

  const isDisabled = playingMusic.id === '';

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (playingMusic.isPlaying) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [playingMusic]);

  const playMusic = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const pauseMusic = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  const togglePlayMusic = () => {
    dispatch(
      appActions.setPlayingMusic({
        ...playingMusic,
        isPlaying: !playingMusic.isPlaying,
      }),
    );
  };

  const timeUpdateHandler = () => {
    if (audioRef.current) setTime(audioRef.current.currentTime);
  };

  const seekHandler = (value: number) => {
    setTime(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  const endedHandler = () => {
    dispatch(appActions.setPlayingMusic({ ...playingMusic, isPlaying: false }));
  };

  return (
    <HStack
      opacity={isDisabled ? 0.5 : 1}
      pointerEvents={isDisabled ? 'none' : 'all'}
    >
      <audio
        ref={audioRef}
        src={
          playingMusic.relativePath !== ''
            ? `${assetsPath}\\${playingMusic.relativePath}`
            : ''
        }
        style={{ display: 'none' }}
        onTimeUpdate={timeUpdateHandler}
        onEnded={endedHandler}
      />
      <IconButton
        icon={
          playingMusic.isPlaying ? (
            <IconPlayerPauseFilled size={18} />
          ) : (
            <IconPlayerPlayFilled size={18} />
          )
        }
        aria-label="play"
        colorScheme="purple"
        isRound
        onClick={() => togglePlayMusic()}
      />
      <Center position="relative" fontSize="x-small" color="gray.400" h="32px">
        <Marquee
          speed={20}
          gradient
          gradientWidth={12}
          style={{ position: 'absolute', top: 0, zIndex: 0 }}
        >
          {`${playingMusic.name}      `}
        </Marquee>
        <Slider
          value={time}
          min={0}
          max={audioRef.current?.duration || 1}
          w={200}
          h="100%"
          onChange={seekHandler}
        >
          <SliderTrack bg="purple.100">
            <SliderFilledTrack bg="purple.400" />
          </SliderTrack>
        </Slider>
        <Flex
          position="absolute"
          bottom="0"
          justifyContent="space-between"
          w="100%"
          zIndex={-1}
        >
          <Text>{formatTime(time)}</Text>
          <Text>{formatTime(audioRef.current?.duration || 0)}</Text>
        </Flex>
      </Center>
    </HStack>
  );
};

export default MusicPlayer;
