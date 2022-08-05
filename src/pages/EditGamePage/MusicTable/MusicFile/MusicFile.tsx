import { useAppDispatch } from 'hooks/redux';
import { IDropResult } from 'models/IDropResult';
import { IFirstTour } from 'models/IFirstTour';
import { IFourthTour } from 'models/IFourthTour';
import { IMusic, MusicTypes } from 'models/IMusic';
import { ISecondTour } from 'models/ISecondTour';
import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { setMusicPendingAction } from 'store/reducers/AppSlice';
import { setFirstTourAction } from 'store/reducers/FirtsTourSlice';
import { setFourthTourAction } from 'store/reducers/FourthTourSlice';
import { setSecondTourAction } from 'store/reducers/SecondTourSlice';
import styles from './MusicFile.module.css';

interface MusicFileProps {
  music: IMusic;
}

const MusicFile: FC<MusicFileProps> = ({ music }) => {
  const dispatch = useAppDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'pendingMusic',
    item: music,
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

  // FROM MUSIC TABLE
  const dragEndHandler = (dragItem: IMusic, dropResult: IDropResult) => {
    const { musicType, categoryIndex, noteIndex, sevenNoteIndex } = dropResult;

    let oldMusic: IMusic | null = null;

    const activeTourId = Number(localStorage.getItem('activeTourId'));

    if (activeTourId === 1) {
      if (categoryIndex === undefined || noteIndex === undefined) return;

      const firstTourClone: IFirstTour = JSON.parse(
        localStorage.getItem('firstTour') || '{}'
      );
      const newCategories = firstTourClone.categories;

      if (musicType === MusicTypes.backingTrack) {
        oldMusic = newCategories[categoryIndex].notes[noteIndex].backingTrack;
        newCategories[categoryIndex].notes[noteIndex].backingTrack = music;
      } else {
        oldMusic = newCategories[categoryIndex].notes[noteIndex].original;
        newCategories[categoryIndex].notes[noteIndex].original = music;
      }

      const newFirstTour: IFirstTour = {
        tourId: firstTourClone.tourId,
        categories: newCategories,
      };

      dispatch(setFirstTourAction(newFirstTour));
    } else if (activeTourId === 2) {
      if (categoryIndex === undefined || noteIndex === undefined) return;

      const secondTourClone: ISecondTour = JSON.parse(
        localStorage.getItem('secondTour') || '{}'
      );
      const newCategories = secondTourClone.categories;

      if (musicType === MusicTypes.backingTrack) {
        oldMusic = newCategories[categoryIndex].notes[noteIndex].backingTrack;
        newCategories[categoryIndex].notes[noteIndex].backingTrack = music;
      } else {
        oldMusic = newCategories[categoryIndex].notes[noteIndex].original;
        newCategories[categoryIndex].notes[noteIndex].original = music;
      }

      const newSecondTour: ISecondTour = {
        tourId: secondTourClone.tourId,
        categories: newCategories,
      };

      dispatch(setSecondTourAction(newSecondTour));
    } else {
      if (sevenNoteIndex === undefined) return;

      const fourthTourClone: IFourthTour = JSON.parse(
        localStorage.getItem('fourthTour') || '{}'
      );
      const newSevenNotes = fourthTourClone.sevenNotes;

      oldMusic = newSevenNotes[sevenNoteIndex].backingTrack;
      newSevenNotes[sevenNoteIndex].backingTrack = music;

      const newFourthTour: IFourthTour = {
        tourId: fourthTourClone.tourId,
        sevenNotes: newSevenNotes,
      };

      dispatch(setFourthTourAction(newFourthTour));
    }

    dispatch(setMusicPendingAction({ ...dragItem, isPending: false }));
    if (oldMusic) {
      dispatch(setMusicPendingAction({ ...oldMusic, isPending: true }));
    }
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} className={styles.container} style={{ opacity }}>
      {music.name}
    </div>
  );
};

export default MusicFile;
