import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_TOUR } from 'constants/initialStates';
import { IDoubleSharp } from 'types/INote';
import { ITour } from 'types/ITour';

type Tour1SliceState = {
  tour1: ITour;
  activeNoteId: number;
  activeCategoryId: number;
};

const initialState: Tour1SliceState = {
  tour1: INITIAL_TOUR,
  activeNoteId: -1,
  activeCategoryId: 0,
};

export const tour1Slice = createSlice({
  name: 'tour1',
  initialState,
  reducers: {
    setTour1(state, action: PayloadAction<ITour>) {
      state.tour1 = action.payload;
    },
    setDoubleSharp(
      state,
      action: PayloadAction<{
        categoryIndex: number;
        noteIndex: number;
        doubleSharp: IDoubleSharp | null;
      }>,
    ) {
      state.tour1.categories[action.payload.categoryIndex].notes[
        action.payload.noteIndex
      ].doubleSharp = action.payload.doubleSharp;
    },
    setActiveNoteId(state, action: PayloadAction<number>) {
      state.activeNoteId = action.payload;
    },
    setActiveCategoryId(state, action: PayloadAction<number>) {
      state.activeCategoryId = action.payload;
    },
    clearState(state) {
      state.activeCategoryId = initialState.activeCategoryId;
      state.activeNoteId = initialState.activeNoteId;
    },
  },
});

export const tour1Actions = tour1Slice.actions;
export default tour1Slice.reducer;
