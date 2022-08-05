import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMusicTheme } from 'models/IMusicTheme';
import { IThirdTour } from 'models/IThirdTour';

const initialMusicThemes: IMusicTheme[] = [
  {
    id: 1,
    image: '',
    pianoNotes: [],
  },
  {
    id: 2,
    image: '',
    pianoNotes: [],
  },
  {
    id: 3,
    image: '',
    pianoNotes: [],
  },
  {
    id: 4,
    image: '',
    pianoNotes: [],
  },
  {
    id: 5,
    image: '',
    pianoNotes: [],
  },
];

const initialThirdTour: IThirdTour = {
  tourId: 3,
  musicThemes: initialMusicThemes,
};

type ThirdTourSliceState = {
  thirdTour: IThirdTour;
  lastPlayingTime: number;
};

const initialState: ThirdTourSliceState = {
  thirdTour: initialThirdTour,
  lastPlayingTime: 0,
};

export const thirdTourSlice = createSlice({
  name: 'thirdTour',
  initialState,
  reducers: {
    setThirdTourAction(state, action: PayloadAction<IThirdTour>) {
      state.thirdTour = action.payload;
    },
    setMusicThemesAction(state, action: PayloadAction<IMusicTheme[]>) {
      state.thirdTour.musicThemes = action.payload;
    },
    setLastPlayingTimeAction(state, action: PayloadAction<number>) {
      state.lastPlayingTime = action.payload;
    },
  },
});

export const {
  setThirdTourAction,
  setMusicThemesAction,
  setLastPlayingTimeAction,
} = thirdTourSlice.actions;

export default thirdTourSlice.reducer;
