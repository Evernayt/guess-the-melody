import { MusicTypes } from './IMusic';

export interface IDragItem {
  musicType: MusicTypes;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
}
