export enum PianoKeyColors {
  white = 'W',
  black = 'B',
}

export interface IPianoNote {
  key: string;
  color: PianoKeyColors;
  delay: number;
}

export interface IMusicTheme {
  id: number;
  imagePath: string;
  pianoNotes: IPianoNote[];
}
