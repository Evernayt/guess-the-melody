export enum MusicTypes {
  backingTrack = 'backingTrack',
  original = 'original',
}

export interface IMusic {
  id: string;
  name: string;
  path: string;
  isPending: boolean;
}
