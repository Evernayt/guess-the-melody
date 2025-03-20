import { MIN_PIANO_NOTES } from 'constants/initialStates';
import { IMusic } from 'types/IMusic';
import { ITour } from 'types/ITour';
import { ITour3 } from 'types/ITour3';
import { ITour4 } from 'types/ITour4';

const TOUR_1_KEY = 'TOUR_1_KEY';
const TOUR_2_KEY = 'TOUR_2_KEY';
const TOUR_3_KEY = 'TOUR_3_KEY';
const TOUR_4_KEY = 'TOUR_4_KEY';
const VOLUME_KEY = 'VOLUME_KEY';
const MUSIC_FILES_KEY = 'MUSIC_FILES_KEY';
const POINTS_INCREASE_RATE_KEY = 'POINTS_INCREASE_RATE_KEY';
const INITIAL_TIMER_KEY = 'INITIAL_TIMER_KEY';
const MAX_PIANO_NOTES_KEY = 'MAX_PIANO_NOTES_KEY';

const setTour1 = (tour1: ITour) => {
  localStorage.setItem(TOUR_1_KEY, JSON.stringify(tour1));
};

const getTour1 = (): ITour | null => {
  const tour1 = JSON.parse(localStorage.getItem(TOUR_1_KEY) || '{}');
  if (Object.keys(tour1).length) {
    return tour1;
  } else {
    return null;
  }
};

const setTour2 = (tour2: ITour) => {
  localStorage.setItem(TOUR_2_KEY, JSON.stringify(tour2));
};

const getTour2 = (): ITour | null => {
  const tour2 = JSON.parse(localStorage.getItem(TOUR_2_KEY) || '{}');
  if (Object.keys(tour2).length) {
    return tour2;
  } else {
    return null;
  }
};

const setTour4 = (tour4: ITour4) => {
  localStorage.setItem(TOUR_4_KEY, JSON.stringify(tour4));
};

const getTour4 = (): ITour4 | null => {
  const tour4 = JSON.parse(localStorage.getItem(TOUR_4_KEY) || '{}');
  if (Object.keys(tour4).length) {
    return tour4;
  } else {
    return null;
  }
};

const setTour3 = (tour3: ITour3) => {
  localStorage.setItem(TOUR_3_KEY, JSON.stringify(tour3));
};

const getTour3 = (): ITour3 | null => {
  const tour3 = JSON.parse(localStorage.getItem(TOUR_3_KEY) || '{}');
  if (Object.keys(tour3).length) {
    return tour3;
  } else {
    return null;
  }
};

const setVolume = (volume: number) => {
  localStorage.setItem(VOLUME_KEY, volume.toString());
};

const getVolume = (): number => {
  const volume = localStorage.getItem(VOLUME_KEY);
  return Number(volume);
};

const setMusicFiles = (musicFiles: IMusic[]) => {
  localStorage.setItem(MUSIC_FILES_KEY, JSON.stringify(musicFiles));
};

const getMusicFiles = (): IMusic[] => {
  const musicFiles = JSON.parse(localStorage.getItem(MUSIC_FILES_KEY) || '[]');
  return musicFiles;
};

const setPointsIncreaseRate = (pointsIncreaseRate: number) => {
  localStorage.setItem(POINTS_INCREASE_RATE_KEY, pointsIncreaseRate.toString());
};

const getPointsIncreaseRate = (): number => {
  const pointsIncreaseRate = localStorage.getItem(POINTS_INCREASE_RATE_KEY);
  return pointsIncreaseRate ? Number(pointsIncreaseRate) : 100;
};

const setInitialTimer = (initialTimer: number) => {
  localStorage.setItem(INITIAL_TIMER_KEY, initialTimer.toString());
};

const getInitialTimer = (): number => {
  const initialTimer = localStorage.getItem(INITIAL_TIMER_KEY);
  return initialTimer ? Number(initialTimer) : 30;
};

const setMaxPianoNotes = (maxPianoNotes: number) => {
  localStorage.setItem(MAX_PIANO_NOTES_KEY, maxPianoNotes.toString());
};

const getMaxPianoNotes = (): number => {
  const maxPianoNotes = localStorage.getItem(MAX_PIANO_NOTES_KEY);
  return maxPianoNotes ? Number(maxPianoNotes) : MIN_PIANO_NOTES;
};

export {
  setTour1,
  getTour1,
  setTour2,
  getTour2,
  setTour3,
  getTour3,
  setTour4,
  getTour4,
  setVolume,
  getVolume,
  setMusicFiles,
  getMusicFiles,
  setPointsIncreaseRate,
  getPointsIncreaseRate,
  setInitialTimer,
  getInitialTimer,
  setMaxPianoNotes,
  getMaxPianoNotes,
};
