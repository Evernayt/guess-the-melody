import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMusic } from 'models/IMusic';

type AppState = {
  activeTourId: number;
  volume: number;
  error: string;
  musicFiles: IMusic[];
  stopAllMusic: boolean;
  assetsPath: string;
};

const initialState: AppState = {
  activeTourId: 1,
  volume: 0.5,
  error: '',
  musicFiles: [],
  stopAllMusic: false,
  assetsPath: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveTourIdAction(state, action: PayloadAction<number>) {
      state.activeTourId = action.payload;
    },
    setVolumeAction(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setErrorAction(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setMusicFilesAction(state, action: PayloadAction<IMusic[]>) {
      state.musicFiles = action.payload;
    },
    addMusicFileAction(state, action: PayloadAction<IMusic>) {
      state.musicFiles.push(action.payload);
    },
    removeMusicFileAction(state, action: PayloadAction<string>) {
      const musicFiles = state.musicFiles.filter(
        (musicFile) => musicFile.id !== action.payload
      );
      state.musicFiles = musicFiles;
    },
    setMusicPendingAction(state, action: PayloadAction<IMusic>) {
      state.musicFiles.map((musicFile) =>
        musicFile.id === action.payload.id
          ? (musicFile.isPending = action.payload.isPending)
          : musicFile
      );
    },
    setStopAllMusicAction(state, action: PayloadAction<boolean>) {
      state.stopAllMusic = action.payload;
    },
    setAssetsPathAction(state, action: PayloadAction<string>) {
      state.assetsPath = action.payload;
    },
  },
});

export const {
  setActiveTourIdAction,
  setVolumeAction,
  setErrorAction,
  setMusicFilesAction,
  addMusicFileAction,
  removeMusicFileAction,
  setMusicPendingAction,
  setStopAllMusicAction,
  setAssetsPathAction,
} = appSlice.actions;

export default appSlice.reducer;
