import { createClone } from 'helpers';
import { useAppDispatch } from 'hooks/redux';
import { IDragItem } from 'models/IDragItem';
import { DropTargets, IDropResult } from 'models/IDropResult';
import { IMusic, MusicTypes } from 'models/IMusic';
import { INote } from 'models/INote';
import { ISecondTour } from 'models/ISecondTour';
import { FC } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { setMusicPendingAction } from 'store/reducers/AppSlice';
import { setSecondTourAction } from 'store/reducers/SecondTourSlice';
import styles from './SecondTourMusicItem.module.css';

interface SecondTourMusicItemProps {
  music: IMusic | null;
  musicType: MusicTypes;
  categoryIndex: number;
  noteIndex: number;
}

const SecondTourMusicItem: FC<SecondTourMusicItemProps> = ({
  music,
  musicType,
  categoryIndex,
  noteIndex,
}) => {
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ['pendingMusic', 'music'],
    drop: (): IDropResult => ({
      target: DropTargets.editTable,
      musicType,
      categoryIndex,
      noteIndex,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'music',
    item: { music, categoryIndex, noteIndex, musicType },
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
    const { target, musicType, categoryIndex, noteIndex } = dropResult;

    if (
      categoryIndex === undefined ||
      noteIndex === undefined ||
      dragItem.categoryIndex === undefined ||
      dragItem.noteIndex === undefined
    ) {
      return;
    }

    if (target === DropTargets.editTable) {
      if (
        categoryIndex === dragItem.categoryIndex &&
        noteIndex === dragItem.noteIndex &&
        musicType === dragItem.musicType
      ) {
        return;
      }

      const secondTour: ISecondTour = JSON.parse(
        localStorage.getItem('secondTour') || '{}'
      );

      const newCategories = secondTour.categories;
      const oldNotes: INote = createClone(
        secondTour.categories[categoryIndex].notes[noteIndex]
      );

      let oldMusic: IMusic | null = null;

      if (musicType === MusicTypes.backingTrack) {
        oldMusic = oldNotes.backingTrack;

        if (dragItem.musicType === MusicTypes.backingTrack) {
          newCategories[categoryIndex].notes[noteIndex].backingTrack =
            newCategories[dragItem.categoryIndex].notes[
              dragItem.noteIndex
            ].backingTrack;
        } else {
          newCategories[categoryIndex].notes[noteIndex].backingTrack =
            newCategories[dragItem.categoryIndex].notes[
              dragItem.noteIndex
            ].original;
        }
      } else {
        oldMusic = oldNotes.original;

        if (dragItem.musicType === MusicTypes.backingTrack) {
          newCategories[categoryIndex].notes[noteIndex].original =
            newCategories[dragItem.categoryIndex].notes[
              dragItem.noteIndex
            ].backingTrack;
        } else {
          newCategories[categoryIndex].notes[noteIndex].original =
            newCategories[dragItem.categoryIndex].notes[
              dragItem.noteIndex
            ].original;
        }
      }

      if (dragItem.musicType === MusicTypes.backingTrack) {
        newCategories[dragItem.categoryIndex].notes[
          dragItem.noteIndex
        ].backingTrack = null;
      } else {
        newCategories[dragItem.categoryIndex].notes[
          dragItem.noteIndex
        ].original = null;
      }

      const newSecondTour: ISecondTour = {
        tourId: secondTour.tourId,
        categories: newCategories,
      };

      dispatch(setSecondTourAction(newSecondTour));

      if (oldMusic) {
        dispatch(setMusicPendingAction({ ...oldMusic, isPending: true }));
      }
    } else {
      const secondTour: ISecondTour = JSON.parse(
        localStorage.getItem('secondTour') || '{}'
      );

      const newCategories = secondTour.categories;

      let oldMusic: IMusic | null = null;

      if (dragItem.musicType === MusicTypes.backingTrack) {
        oldMusic =
          newCategories[dragItem.categoryIndex].notes[dragItem.noteIndex]
            .backingTrack;

        newCategories[dragItem.categoryIndex].notes[
          dragItem.noteIndex
        ].backingTrack = null;
      } else {
        oldMusic =
          newCategories[dragItem.categoryIndex].notes[dragItem.noteIndex]
            .original;

        newCategories[dragItem.categoryIndex].notes[
          dragItem.noteIndex
        ].original = null;
      }

      const newSecondTour: ISecondTour = {
        tourId: secondTour.tourId,
        categories: newCategories,
      };

      dispatch(setSecondTourAction(newSecondTour));

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

export default SecondTourMusicItem;
