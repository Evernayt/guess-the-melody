import { MusicVariants } from './IMusic';

export interface IDragItem {
  musicVariant: MusicVariants;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
}
