import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_TOUR } from 'constants/initialStates';
import { INextNotePoint } from 'types/INextNotePoint';
import { ITour } from 'types/ITour';

type Tour2State = {
  tour2: ITour;
  pointsIncreaseRate: number;
  activeNoteId: number;
  activeCategoryId: number;
  tour2Interval: number | null;
  nextNotePoints: INextNotePoint[];
  stopAllNoteIntervals: boolean;
};

const initialState: Tour2State = {
  tour2: INITIAL_TOUR,
  pointsIncreaseRate: 160,
  activeNoteId: -1,
  activeCategoryId: 0,
  tour2Interval: null,
  nextNotePoints: [],
  stopAllNoteIntervals: false,
};

export const tour2Slice = createSlice({
  name: 'tour2',
  initialState,
  reducers: {
    setTour2(state, action: PayloadAction<ITour>) {
      state.tour2 = action.payload;
    },
    setPointsIncreaseRate(state, action: PayloadAction<number>) {
      state.pointsIncreaseRate = action.payload;
    },
    setActiveNoteId(state, action: PayloadAction<number>) {
      state.activeNoteId = action.payload;
    },
    setActiveCategoryId(state, action: PayloadAction<number>) {
      state.activeCategoryId = action.payload;
    },
    setTour2Interval(state, action: PayloadAction<number | null>) {
      state.tour2Interval = action.payload;
    },
    editNextNotePoints(state, action: PayloadAction<INextNotePoint>) {
      state.nextNotePoints[action.payload.categoryIndex] = action.payload;
    },
    stopAllNoteIntervals(state) {
      state.stopAllNoteIntervals = !state.stopAllNoteIntervals;
    },
    clearState(state) {
      state.activeCategoryId = initialState.activeCategoryId;
      state.activeNoteId = initialState.activeNoteId;
      state.nextNotePoints = initialState.nextNotePoints;
    },
  },
});

export const tour2Actions = tour2Slice.actions;
export default tour2Slice.reducer;
