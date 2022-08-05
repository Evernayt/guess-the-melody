import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from 'models/ICategory';
import { IFirstTour } from 'models/IFirstTour';
import { IDoubleSharp } from 'models/INote';

const initialCategories: ICategory[] = [
  {
    id: 1,
    name: '',
    notes: [
      {
        id: 11,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 12,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 13,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 14,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
    ],
  },
  {
    id: 2,
    name: '',
    notes: [
      {
        id: 21,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 22,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 23,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 24,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
    ],
  },
  {
    id: 3,
    name: '',
    notes: [
      {
        id: 31,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 32,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 33,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 34,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
    ],
  },
  {
    id: 4,
    name: '',
    notes: [
      {
        id: 41,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 42,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 43,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
      {
        id: 44,
        number: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
      },
    ],
  },
];

const initialFirstTour: IFirstTour = {
  tourId: 1,
  categories: initialCategories,
};

type FirstTourSliceState = {
  firstTour: IFirstTour;
  firstTourActiveNoteId: number;
  firstTourActiveCategoryId: number;
};

const initialState: FirstTourSliceState = {
  firstTour: initialFirstTour,
  firstTourActiveNoteId: 0,
  firstTourActiveCategoryId: 0,
};

export const firstTourSlice = createSlice({
  name: 'firstTour',
  initialState,
  reducers: {
    setFirstTourActiveNoteIdAction(state, action: PayloadAction<number>) {
      state.firstTourActiveNoteId = action.payload;
    },
    setFirstTourActiveCategoryIdAction(state, action: PayloadAction<number>) {
      state.firstTourActiveCategoryId = action.payload;
    },
    setFirstTourAction(state, action: PayloadAction<IFirstTour>) {
      state.firstTour = action.payload;
    },
    setFirstTourDoubleSharpAction(
      state,
      action: PayloadAction<{
        categoryIndex: number;
        noteIndex: number;
        doubleSharp: IDoubleSharp | null;
      }>
    ) {
      state.firstTour.categories[action.payload.categoryIndex].notes[
        action.payload.noteIndex
      ].doubleSharp = action.payload.doubleSharp;
    },
  },
});

export const {
  setFirstTourActiveNoteIdAction,
  setFirstTourActiveCategoryIdAction,
  setFirstTourAction,
  setFirstTourDoubleSharpAction,
} = firstTourSlice.actions;

export default firstTourSlice.reducer;
