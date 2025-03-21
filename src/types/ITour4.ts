import { IMusic } from './IMusic';

export interface ISevenNote {
  id: number;
  backingTrack: IMusic | null;
}

export interface ITour4 {
  tourId: number;
  sevenNotes: ISevenNote[];
}
