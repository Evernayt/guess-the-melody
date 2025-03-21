import { MusicVariants } from './IMusic';

export enum DropTargets {
  editTable = 'editTable',
  musicTable = 'musicTable',
}

export interface IDropResult {
  target: DropTargets;
  musicVariant: MusicVariants;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
}
