import { createClone } from 'helpers';
import { useAppDispatch } from 'hooks/redux';
import { IDragItem } from 'models/IDragItem';
import { DropTargets, IDropResult } from 'models/IDropResult';
import { IFirstTour } from 'models/IFirstTour';
import { IMusic, MusicTypes } from 'models/IMusic';
import { INote } from 'models/INote';
import { FC } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { setMusicPendingAction } from 'store/reducers/AppSlice';
import { setFirstTourAction } from 'store/reducers/FirtsTourSlice';
import styles from './FirstTourMusicItem.module.css';

interface FirstTourMusicItemProps {
  music: IMusic | null;
  musicType: MusicTypes;
  categoryIndex: number;
  noteIndex: number;
}

const FirstTourMusicItem: FC<FirstTourMusicItemProps> = ({
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

    if (target === DropTargets.editTable) {
      if (
        categoryIndex === undefined ||
        noteIndex === undefined ||
        dragItem.categoryIndex === undefined ||
        dragItem.noteIndex === undefined
      ) {
        return;
      }

      if (
        categoryIndex === dragItem.categoryIndex &&
        noteIndex === dragItem.noteIndex &&
        musicType === dragItem.musicType
      ) {
        return;
      }

      const firstTour: IFirstTour = JSON.parse(
        localStorage.getItem('firstTour') || '{}'
      );

      const newCategories = firstTour.categories;
      const oldNotes: INote = createClone(
        firstTour.categories[categoryIndex].notes[noteIndex]
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

      const newFirstTour: IFirstTour = {
        tourId: firstTour.tourId,
        categories: newCategories,
      };

      dispatch(setFirstTourAction(newFirstTour));

      if (oldMusic) {
        dispatch(setMusicPendingAction({ ...oldMusic, isPending: true }));
      }
    } else {
      if (
        dragItem.categoryIndex === undefined ||
        dragItem.noteIndex === undefined
      ) {
        return;
      }

      const firstTour: IFirstTour = JSON.parse(
        localStorage.getItem('firstTour') || '{}'
      );

      const newCategories = firstTour.categories;

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

      const newFirstTour: IFirstTour = {
        tourId: firstTour.tourId,
        categories: newCategories,
      };

      dispatch(setFirstTourAction(newFirstTour));

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

export default FirstTourMusicItem;
