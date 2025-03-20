import { ICategory } from 'types/ICategory';
import { IModal } from 'types/IModal';
import { IMusicTheme } from 'types/IMusicTheme';
import { IStatesSevenNote } from 'types/IStatesSevenNote';
import { ITour } from 'types/ITour';
import { ITour3 } from 'types/ITour3';
import { ISevenNote, ITour4 } from 'types/ITour4';
import IMAGES from './images';
import { IPlayingMusic } from 'types/IPlayingMusic';
import { IPlayingNote } from 'types/IPlayingNote';
import { MusicVariants } from 'types/IMusic';

const INITIAL_MODAL: IModal = { isOpen: false };

const INITIAL_CATEGORIES: ICategory[] = [
  {
    id: 1,
    name: '',
    notes: [
      {
        id: 0,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 1,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 2,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 3,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
    ],
  },
  {
    id: 2,
    name: '',
    notes: [
      {
        id: 4,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 5,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 6,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 7,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
    ],
  },
  {
    id: 3,
    name: '',
    notes: [
      {
        id: 8,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 9,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 10,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 11,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
    ],
  },
  {
    id: 4,
    name: '',
    notes: [
      {
        id: 12,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 13,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 14,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
      {
        id: 15,
        points: 0,
        backingTrack: null,
        original: null,
        doubleSharp: null,
        originalStartTime: 0,
      },
    ],
  },
];

const INITIAL_TOUR: ITour = {
  tour: 1,
  categories: INITIAL_CATEGORIES,
};

const INITIAL_MUSIC_THEMES: IMusicTheme[] = [
  {
    id: 1,
    imagePath: '',
    pianoNotes: [],
  },
  {
    id: 2,
    imagePath: '',
    pianoNotes: [],
  },
  {
    id: 3,
    imagePath: '',
    pianoNotes: [],
  },
  {
    id: 4,
    imagePath: '',
    pianoNotes: [],
  },
  {
    id: 5,
    imagePath: '',
    pianoNotes: [],
  },
];

const INITIAL_TOUR_3: ITour3 = {
  tourId: 3,
  musicThemes: INITIAL_MUSIC_THEMES,
};

const INITIAL_SEVEN_NOTES: ISevenNote[] = [
  {
    id: 1,
    backingTrack: null,
  },
  {
    id: 2,
    backingTrack: null,
  },
  {
    id: 3,
    backingTrack: null,
  },
  {
    id: 4,
    backingTrack: null,
  },
  {
    id: 5,
    backingTrack: null,
  },
  {
    id: 6,
    backingTrack: null,
  },
  {
    id: 7,
    backingTrack: null,
  },
];

const INITIAL_TOUR_4: ITour4 = {
  tourId: 4,
  sevenNotes: INITIAL_SEVEN_NOTES,
};

const INITIAL_STATES_SEVBEN_NOTES: IStatesSevenNote[] = [
  {
    id: 1,
    offImage: IMAGES.seven_notes_off_4,
    onImage: IMAGES.seven_notes_on_4,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 2,
    offImage: IMAGES.seven_notes_off_5,
    onImage: IMAGES.seven_notes_on_5,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 3,
    offImage: IMAGES.seven_notes_off_6,
    onImage: IMAGES.seven_notes_on_6,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 4,
    offImage: IMAGES.seven_notes_off_7,
    onImage: IMAGES.seven_notes_on_7,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 5,
    offImage: IMAGES.seven_notes_off_8,
    onImage: IMAGES.seven_notes_on_8,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 6,
    offImage: IMAGES.seven_notes_off_9,
    onImage: IMAGES.seven_notes_on_9,
    isGuessed: false,
    isSkipped: false,
  },
  {
    id: 7,
    offImage: IMAGES.seven_notes_off_10,
    onImage: IMAGES.seven_notes_on_10,
    isGuessed: false,
    isSkipped: false,
  },
];

const MIN_PIANO_NOTES = 7;

const INITIAL_PLAYING_MUSIC: IPlayingMusic = {
  id: '',
  name: '',
  relativePath: '',
  isPlaying: false,
};

const INITIAL_PLAYING_NOTE: IPlayingNote = {
  noteId: 0,
  relativePath: '',
  originalStartTime: 0,
  isPlaying: false,
  musicVariant: MusicVariants.backingTrack,
};

export {
  INITIAL_MODAL,
  INITIAL_TOUR,
  INITIAL_TOUR_3,
  INITIAL_TOUR_4,
  INITIAL_STATES_SEVBEN_NOTES,
  MIN_PIANO_NOTES,
  INITIAL_PLAYING_MUSIC,
  INITIAL_PLAYING_NOTE,
};
