import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from 'models/ICategory';
import { INextNoteNumber } from 'models/INextNoteNumber';
import { ISecondTour } from 'models/ISecondTour';

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

const initialSecondTour: ISecondTour = {
  tourId: 2,
  categories: initialCategories,
};

type SecondTourState = {
  secondTour: ISecondTour;
  secondTourActiveNoteId: number;
  secondTourActiveCategoryId: number;
  secondTourInterval: NodeJS.Timer | null;
  nextNoteNumbers: INextNoteNumber[];
  stopAllNoteIntervals: boolean;
  numberIncrementSpeed: number;
};

const initialState: SecondTourState = {
  secondTour: initialSecondTour,
  secondTourActiveNoteId: 0,
  secondTourActiveCategoryId: 0,
  secondTourInterval: null,
  nextNoteNumbers: [],
  stopAllNoteIntervals: false,
  numberIncrementSpeed: 160,
};

export const secondTourSlice = createSlice({
  name: 'secondTour',
  initialState,
  reducers: {
    setSecondTourActiveNoteIdAction(state, action: PayloadAction<number>) {
      state.secondTourActiveNoteId = action.payload;
    },
    setSecondTourActiveCategoryIdAction(state, action: PayloadAction<number>) {
      state.secondTourActiveCategoryId = action.payload;
    },
    setSecondTourAction(state, action: PayloadAction<ISecondTour>) {
      state.secondTour = action.payload;
    },
    setSecondTourIntervalAction(
      state,
      action: PayloadAction<NodeJS.Timer | null>
    ) {
      state.secondTourInterval = action.payload;
    },
    editNextNoteNumberAction(state, action: PayloadAction<INextNoteNumber>) {
      state.nextNoteNumbers[action.payload.categoryIndex] = action.payload;
    },
    stopAllNoteIntervalsAction(state) {
      state.stopAllNoteIntervals = !state.stopAllNoteIntervals;
    },
    setNumberIncrementSpeedAction(state, action: PayloadAction<number>) {
      state.numberIncrementSpeed = action.payload;
    },
  },
});

export const {
  setSecondTourActiveNoteIdAction,
  setSecondTourActiveCategoryIdAction,
  setSecondTourAction,
  setSecondTourIntervalAction,
  editNextNoteNumberAction,
  stopAllNoteIntervalsAction,
  setNumberIncrementSpeedAction,
} = secondTourSlice.actions;

export default secondTourSlice.reducer;
