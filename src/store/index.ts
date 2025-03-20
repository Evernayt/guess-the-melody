import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import ModalSlice from './reducers/ModalSlice';
import Tour1Slice from './reducers/Tour1Slice';
import Tour2Slice from './reducers/Tour2Slice';
import Tour3Slice from './reducers/Tour3Slice';
import Tour4Slice from './reducers/Tour4Slice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    tour1: Tour1Slice,
    tour2: Tour2Slice,
    tour3: Tour3Slice,
    tour4: Tour4Slice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
