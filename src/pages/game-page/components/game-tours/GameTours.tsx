import TourSelect from 'components/tour-select/TourSelect';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { appActions } from 'store/reducers/AppSlice';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { tour2Actions } from 'store/reducers/Tour2Slice';

const GameTours = () => {
  const activeTour = useAppSelector((state) => state.app.activeTour);
  const tour2Interval = useAppSelector((state) => state.tour2.tour2Interval);

  const dispatch = useAppDispatch();
  const { setInterval, clearInterval } = window;

  const selectTour = (tour: number) => {
    dispatch(appActions.setActiveTour(tour));
    if (tour === 2) {
      dispatch(tour2Actions.clearState());
      let categoryId = 1;
      let noteId = 0;
      const tour2Interval = setInterval(() => {
        dispatch(tour2Actions.setActiveCategoryId(categoryId));
        dispatch(tour2Actions.setActiveNoteId(noteId));
        categoryId === 4 ? (categoryId = 1) : categoryId++;
        noteId === 12 ? (noteId = 0) : noteId += 4;
      }, 500);
      dispatch(tour2Actions.setTour2Interval(tour2Interval));
    } else {
      dispatch(tour1Actions.clearState());
      if (tour2Interval) {
        clearInterval(tour2Interval);
      }
    }
  };

  return <TourSelect tour={activeTour} onChange={selectTour} />;
};

export default GameTours;
