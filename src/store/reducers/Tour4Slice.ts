import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_TOUR_4 } from 'constants/initialStates';
import { ITour4 } from 'types/ITour4';

type Tour4SliceState = {
  tour4: ITour4;
  initialTimer: number;
};

const initialState: Tour4SliceState = {
  tour4: INITIAL_TOUR_4,
  initialTimer: 30,
};

export const tour4Slice = createSlice({
  name: 'tour4',
  initialState,
  reducers: {
    setTour4(state, action: PayloadAction<ITour4>) {
      state.tour4 = action.payload;
    },
    setTour4InitialTimer(state, action: PayloadAction<number>) {
      state.initialTimer = action.payload;
    },
  },
});

export const tour4Actions = tour4Slice.actions;
export default tour4Slice.reducer;
