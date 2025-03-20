export enum MusicVariants {
  backingTrack = 'backingTrack',
  original = 'original',
}

export interface IMusic {
  id: string;
  name: string;
  relativePath: string;
  isPending: boolean;
}
