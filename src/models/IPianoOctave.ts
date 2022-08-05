export interface IPianoKey {
  key: string;
  sound: string;
  keyboard_keys: string[];
}

export interface IPianoOctave {
  id: number;
  whiteKey: IPianoKey;
  blackKey: IPianoKey | null;
}
