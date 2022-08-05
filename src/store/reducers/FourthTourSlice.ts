import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFourthTour, ISevenNote } from 'models/IFourthTour';

const initialSevenNotes: ISevenNote[] = [
  {
    id: 1,
    backingTrack: null,
  },
  {
    id: 2,
    backingTrack: null,
  },
  {
    id: 3,
    backingTrack: null,
  },
  {
    id: 4,
    backingTrack: null,
  },
  {
    id: 5,
    backingTrack: null,
  },
  {
    id: 6,
    backingTrack: null,
  },
  {
    id: 7,
    backingTrack: null,
  },
];

const initialFourthTour: IFourthTour = {
  tourId: 4,
  sevenNotes: initialSevenNotes,
};

type FourthTourSliceState = {
  fourthTour: IFourthTour;
  initialTimer: number;
};

const initialState: FourthTourSliceState = {
  fourthTour: initialFourthTour,
  initialTimer: 30,
};

export const fourthTourSlice = createSlice({
  name: 'fourthTour',
  initialState,
  reducers: {
    setFourthTourAction(state, action: PayloadAction<IFourthTour>) {
      state.fourthTour = action.payload;
    },
    setFourthTourInitialTimerAction(state, action: PayloadAction<number>) {
      state.initialTimer = action.payload;
    },
  },
});

export const { setFourthTourAction, setFourthTourInitialTimerAction } =
  fourthTourSlice.actions;

export default fourthTourSlice.reducer;
