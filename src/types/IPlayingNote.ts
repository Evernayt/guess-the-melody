import { MusicVariants } from './IMusic';

export interface IPlayingNote {
  noteId: number;
  relativePath: string;
  originalStartTime: number;
  isPlaying: boolean;
  musicVariant: MusicVariants;
}
