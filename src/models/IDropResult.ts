import { MusicTypes } from './IMusic';

export enum DropTargets {
  editTable = 'editTable',
  musicTable = 'musicTable',
}

export interface IDropResult {
  target: DropTargets;
  musicType: MusicTypes;
  categoryIndex?: number;
  noteIndex?: number;
  sevenNoteIndex?: number;
}
