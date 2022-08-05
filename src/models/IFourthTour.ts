import { IMusic } from './IMusic';

export interface ISevenNote {
  id: number;
  backingTrack: IMusic | null;
}

export interface IFourthTour {
  tourId: number;
  sevenNotes: ISevenNote[];
}
