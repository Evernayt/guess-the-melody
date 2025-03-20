import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconTrashX,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { appActions } from 'store/reducers/AppSlice';
import { IDropResult } from 'types/IDropResult';
import { IMusic } from 'types/IMusic';
import { INITIAL_PLAYING_MUSIC } from 'constants/initialStates';
import styles from './MusicFile.module.scss';

interface MusicFileProps {
  music: IMusic;
  num: number;
  onDragStart: () => void;
  onDragEnd: (dragItem: IMusic, dropResult: IDropResult | null) => void;
}

const MusicFile: FC<MusicFileProps> = ({
  music,
  num,
  onDragStart,
  onDragEnd,
}) => {
  const [removingMusicId, setRemovingMusicId] = useState<string>('');

  const playingMusic = useAppSelector((state) => state.app.playingMusic);

  const isPlaying = playingMusic.id === music.id && playingMusic.isPlaying;

  const dispatch = useAppDispatch();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'pendingMusic',
      item: () => {
        onDragStart();
        return music;
      },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<IDropResult>();
        // FROM MUSIC TABLE
        onDragEnd(item, dropResult);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [music],
  );

  useEffect(() => {
    if (removingMusicId !== '' && removingMusicId !== playingMusic.id) {
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        window.electron.ipcRenderer.sendMessage('remove-music', [
          music.relativePath,
        ]);
      });
      dispatch(appActions.removeMusicFile(removingMusicId));
      setRemovingMusicId('');
    }
  }, [playingMusic.id, removingMusicId]);

  const togglePlayingMusic = () => {
    dispatch(appActions.setPlayingMusic({ ...music, isPlaying: !isPlaying }));
  };

  const removeMusic = () => {
    setRemovingMusicId(music.id);
    if (playingMusic.id === music.id) {
      dispatch(appActions.setPlayingMusic(INITIAL_PLAYING_MUSIC));
    }
  };

  const numProps = isPlaying
    ? { ...{ opacity: 0, display: 'none' } }
    : { ...{ opacity: 1, display: 'block' } };

  const buttonProps = isPlaying
    ? { ...{ opacity: 1, display: 'flex' } }
    : { ...{ opacity: 0, display: 'none' } };

  // D&D STYLES
  const dndItemOpacity = isDragging ? 0.4 : 1;

  return (
    <HStack
      className={styles.container}
      ref={drag}
      cursor="move"
      opacity={dndItemOpacity}
    >
      <Text as="b" p={1} w="32px" textAlign="center" {...numProps}>
        {num}
      </Text>
      <IconButton
        icon={
          isPlaying ? (
            <IconPlayerPauseFilled size={18} />
          ) : (
            <IconPlayerPlayFilled size={18} />
          )
        }
        aria-label="play"
        colorScheme="purple"
        isRound
        {...buttonProps}
        onClick={togglePlayingMusic}
      />
      <Box w="calc(100% - 2rem - 64px)" fontSize="sm" title={music.name}>
        <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {music.name}
        </Text>
      </Box>
      <IconButton
        icon={<IconTrashX size={18} color="gray" />}
        aria-label="remove"
        isLoading={removingMusicId !== ''}
        isRound
        opacity={0}
        onClick={removeMusic}
      />
    </HStack>
  );
};

export default MusicFile;
