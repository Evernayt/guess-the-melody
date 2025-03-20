import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_TOUR_3 } from 'constants/initialStates';
import { IMusicTheme } from 'types/IMusicTheme';
import { ITour3 } from 'types/ITour3';

type Tour3SliceState = {
  tour3: ITour3;
  lastPlayingTime: number;
};

const initialState: Tour3SliceState = {
  tour3: INITIAL_TOUR_3,
  lastPlayingTime: 0,
};

export const tour3Slice = createSlice({
  name: 'tour3',
  initialState,
  reducers: {
    setTour3(state, action: PayloadAction<ITour3>) {
      state.tour3 = action.payload;
    },
    setMusicThemes(state, action: PayloadAction<IMusicTheme[]>) {
      state.tour3.musicThemes = action.payload;
    },
    setLastPlayingTime(state, action: PayloadAction<number>) {
      state.lastPlayingTime = action.payload;
    },
  },
});

export const tour3Actions = tour3Slice.actions;
export default tour3Slice.reducer;
