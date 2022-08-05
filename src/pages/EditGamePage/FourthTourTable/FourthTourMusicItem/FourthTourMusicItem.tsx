import { useAppDispatch } from 'hooks/redux';
import { IDragItem } from 'models/IDragItem';
import { DropTargets, IDropResult } from 'models/IDropResult';
import { IFourthTour } from 'models/IFourthTour';
import { IMusic, MusicTypes } from 'models/IMusic';
import { FC } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { setMusicPendingAction } from 'store/reducers/AppSlice';
import { setFourthTourAction } from 'store/reducers/FourthTourSlice';
import styles from './FourthTourMusicItem.module.css';

interface FourthTourMusicItemProps {
  music: IMusic | null;
  musicType: MusicTypes;
  sevenNoteIndex: number;
}

const FourthTourMusicItem: FC<FourthTourMusicItemProps> = ({
  music,
  musicType,
  sevenNoteIndex,
}) => {
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ['pendingMusic', 'music'],
    drop: (): IDropResult => ({
      target: DropTargets.editTable,
      musicType: MusicTypes.backingTrack,
      sevenNoteIndex,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'music',
    item: { music, musicType, sevenNoteIndex },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<IDropResult>();

      if (item && dropResult) {
        dragEndHandler(item, dropResult);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  // FROM EDIT TABLE
  const dragEndHandler = (dragItem: IDragItem, dropResult: IDropResult) => {
    const { target, sevenNoteIndex } = dropResult;

    if (target === DropTargets.editTable) {
      if (
        sevenNoteIndex === undefined ||
        dragItem.sevenNoteIndex === undefined
      ) {
        return;
      }

      const fourthTour: IFourthTour = JSON.parse(
        localStorage.getItem('fourthTour') || '{}'
      );

      const newSevenNotes = fourthTour.sevenNotes;

      let oldMusic: IMusic | null = null;

      oldMusic = fourthTour.sevenNotes[sevenNoteIndex].backingTrack;

      newSevenNotes[sevenNoteIndex].backingTrack =
        newSevenNotes[dragItem.sevenNoteIndex].backingTrack;

      newSevenNotes[dragItem.sevenNoteIndex].backingTrack = null;

      const newFourthTour: IFourthTour = {
        tourId: fourthTour.tourId,
        sevenNotes: newSevenNotes,
      };

      dispatch(setFourthTourAction(newFourthTour));

      if (oldMusic) {
        dispatch(setMusicPendingAction({ ...oldMusic, isPending: true }));
      }
    } else {
      if (dragItem.sevenNoteIndex === undefined) {
        return;
      }

      const fourthTour: IFourthTour = JSON.parse(
        localStorage.getItem('fourthTour') || '{}'
      );

      const newSevenNotes = fourthTour.sevenNotes;

      let oldMusic: IMusic | null = null;

      oldMusic = newSevenNotes[dragItem.sevenNoteIndex].backingTrack;
      newSevenNotes[dragItem.sevenNoteIndex].backingTrack = null;

      const newFourthTour: IFourthTour = {
        tourId: fourthTour.tourId,
        sevenNotes: newSevenNotes,
      };

      dispatch(setFourthTourAction(newFourthTour));

      if (oldMusic) {
        dispatch(setMusicPendingAction({ ...oldMusic, isPending: true }));
      }
    }
  };

  const isActive = canDrop && isOver;
  let backgroundColor = '#ebeae4';
  if (isActive) {
    backgroundColor = '#ffd60a';
  } else if (canDrop) {
    backgroundColor = '#ffea83';
  }

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div className={styles.music_text_container} ref={drag} style={{ opacity }}>
      <div
        className={styles.music_text}
        title={music?.name}
        ref={drop}
        style={{ backgroundColor }}
      >
        {music?.name ? music.name : 'Не указано'}
      </div>
    </div>
  );
};

export default FourthTourMusicItem;
