import { IMusic } from './IMusic';

export interface IAnswer {
  id: string;
  answer: string;
  isTrue: boolean;
}

export interface IDoubleSharp {
  question: string;
  answers: IAnswer[];
}

export interface INote {
  id: number;
  number: number;
  backingTrack: IMusic | null;
  original: IMusic | null;
  doubleSharp: IDoubleSharp | null;
}
