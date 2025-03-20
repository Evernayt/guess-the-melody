import { Box, Center, Text } from '@chakra-ui/react';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IDragItem } from 'types/IDragItem';
import { DropTargets, IDropResult } from 'types/IDropResult';
import { IMusic, MusicVariants } from 'types/IMusic';
import { appActions } from 'store/reducers/AppSlice';
import styles from './MusicItem.module.scss';

interface MusicItemProps {
  music: IMusic | null;
  musicVariant: MusicVariants;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
  onDragEnd: (dragItem: IDragItem, dropResult: IDropResult | null) => void;
}

interface DragItem {
  music: IMusic | null;
  musicVariant: MusicVariants;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
}

const MusicItem: FC<MusicItemProps> = ({
  music,
  musicVariant,
  categoryIndex,
  noteIndex,
  sevenNoteIndex,
  onDragEnd,
}) => {
  const playingMusic = useAppSelector((state) => state.app.playingMusic);

  const isPlaying = playingMusic.id === music?.id && playingMusic.isPlaying;

  const isDraggable = !!music;
  const musicName = isDraggable ? music.name : 'Не указано';

  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ['pendingMusic', 'music'],
    canDrop: (item: DragItem) => {
      if (
        item.musicVariant === musicVariant &&
        item.categoryIndex === categoryIndex &&
        item.noteIndex === noteIndex &&
        item.sevenNoteIndex === sevenNoteIndex
      ) {
        return false;
      } else {
        return true;
      }
    },
    drop: (): IDropResult => ({
      target: DropTargets.editTable,
      musicVariant,
      categoryIndex,
      noteIndex,
      sevenNoteIndex,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'music',
      item: { music, musicVariant, categoryIndex, noteIndex, sevenNoteIndex },
      canDrag: () => isDraggable,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<IDropResult>();
        // FROM EDIT TABLE
        onDragEnd(item, dropResult);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [music],
  );

  const togglePlayingMusic = () => {
    if (music) {
      dispatch(appActions.setPlayingMusic({ ...music, isPlaying: !isPlaying }));
    }
  };

  // D&D STYLES
  const isActiveDnd = canDrop && isOver;
  let dndItemBgColor = 'gray.200';
  if (isActiveDnd) {
    dndItemBgColor = 'purple.200';
  } else if (canDrop) {
    dndItemBgColor = 'purple.100';
  }
  const dndItemOpacity = isDragging ? 0.4 : 1;

  return (
    <Box
      className={styles.container}
      ref={drag}
      cursor={isDraggable ? 'move' : 'default'}
      opacity={dndItemOpacity}
      bgColor={dndItemBgColor}
    >
      {isDraggable && (
        <Center
          className={isPlaying ? '' : styles.play_button}
          bgColor="gray.200"
          w="24px"
          h="24px"
          position="absolute"
          cursor="pointer"
          onClick={togglePlayingMusic}
        >
          {isPlaying ? (
            <IconPlayerPauseFilled size={14} />
          ) : (
            <IconPlayerPlayFilled size={14} />
          )}
        </Center>
      )}
      <Box title={music?.name} ref={drop} p={1}>
        <Text
          fontSize="xs"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {musicName}
        </Text>
      </Box>
    </Box>
  );
};

export default MusicItem;
