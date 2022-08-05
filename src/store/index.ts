import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import ModalSlice from './reducers/ModalSlice';
import FirtsTourSlice from './reducers/FirtsTourSlice';
import SecondTourSlice from './reducers/SecondTourSlice';
import FourthTourSlice from './reducers/FourthTourSlice';
import ThirdTourSlice from './reducers/ThirdTourSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    firstTour: FirtsTourSlice,
    secondTour: SecondTourSlice,
    thirdTour: ThirdTourSlice,
    fourthTour: FourthTourSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
