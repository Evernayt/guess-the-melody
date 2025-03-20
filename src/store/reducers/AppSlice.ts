import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  INITIAL_PLAYING_MUSIC,
  INITIAL_PLAYING_NOTE,
  MIN_PIANO_NOTES,
} from 'constants/initialStates';
import { IMusic } from 'types/IMusic';
import { IPlayingMusic } from 'types/IPlayingMusic';
import { IPlayingNote } from 'types/IPlayingNote';

type AppState = {
  activeTour: number;
  editingTour: number;
  volume: number;
  musicFiles: IMusic[];
  maxPianoNotes: number;
  assetsPath: string;
  playingMusic: IPlayingMusic;
  playingNote: IPlayingNote;
};

const initialState: AppState = {
  activeTour: 1,
  editingTour: 1,
  volume: 0.5,
  musicFiles: [],
  maxPianoNotes: MIN_PIANO_NOTES,
  assetsPath: '',
  playingMusic: INITIAL_PLAYING_MUSIC,
  playingNote: INITIAL_PLAYING_NOTE,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveTour(state, action: PayloadAction<number>) {
      state.activeTour = action.payload;
    },
    setEditingTour(state, action: PayloadAction<number>) {
      state.editingTour = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setMusicFiles(state, action: PayloadAction<IMusic[]>) {
      state.musicFiles = action.payload;
    },
    addMusicFiles(state, action: PayloadAction<IMusic[]>) {
      state.musicFiles.push(...action.payload);
    },
    removeMusicFile(state, action: PayloadAction<string>) {
      const musicFiles = state.musicFiles.filter(
        (musicFile) => musicFile.id !== action.payload,
      );
      state.musicFiles = musicFiles;
    },
    setMusicPending(state, action: PayloadAction<IMusic>) {
      state.musicFiles.map((musicFile) =>
        musicFile.id === action.payload.id
          ? (musicFile.isPending = action.payload.isPending)
          : musicFile,
      );
    },
    setMaxPianoNotes(state, action: PayloadAction<number>) {
      state.maxPianoNotes = action.payload;
    },
    setAssetsPath(state, action: PayloadAction<string>) {
      state.assetsPath = action.payload;
    },
    setPlayingMusic(state, action: PayloadAction<IPlayingMusic>) {
      state.playingMusic = action.payload;
    },
    setPlayingNote(state, action: PayloadAction<IPlayingNote>) {
      state.playingNote = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
