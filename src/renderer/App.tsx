import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { lazy, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { appActions } from '../store/reducers/AppSlice';
import GamePage from 'pages/game-page/GamePage';
import { Notification } from 'components';
import {
  getInitialTimer,
  getMaxPianoNotes,
  getMusicFiles,
  getPointsIncreaseRate,
  getTour1,
  getTour2,
  getTour3,
  getTour4,
  getVolume,
  setMusicFiles,
  setTour1,
  setTour2,
  setTour3,
  setTour4,
} from 'helpers/localStorage';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { tour2Actions } from 'store/reducers/Tour2Slice';
import { tour3Actions } from 'store/reducers/Tour3Slice';
import { tour4Actions } from 'store/reducers/Tour4Slice';
import './App.css';

const EditGamePage = lazy(() => import('pages/edit-game-page/EditGamePage'));

const App = () => {
  const tour1 = useAppSelector((state) => state.tour1.tour1);
  const tour2 = useAppSelector((state) => state.tour2.tour2);
  const tour3 = useAppSelector((state) => state.tour3.tour3);
  const tour4 = useAppSelector((state) => state.tour4.tour4);
  const musicFiles = useAppSelector((state) => state.app.musicFiles);

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadAssetsPath();

    const localTour1 = getTour1();
    const localTour2 = getTour2();
    const localTour3 = getTour3();
    const localTour4 = getTour4();
    const localVolume = getVolume();
    const localMusicFiles = getMusicFiles();
    const localPointsIncreaseRate = getPointsIncreaseRate();
    const localInitialTimer = getInitialTimer();
    const localMaxPianoNotes = getMaxPianoNotes();

    if (localTour1) {
      dispatch(tour1Actions.setTour1(localTour1));
    }
    if (localTour2) {
      dispatch(tour2Actions.setTour2(localTour2));
    }
    if (localTour3) {
      dispatch(tour3Actions.setTour3(localTour3));
    }
    if (localTour4) {
      dispatch(tour4Actions.setTour4(localTour4));
    }
    dispatch(appActions.setVolume(localVolume));
    if (localMusicFiles.length > 0) {
      dispatch(appActions.setMusicFiles(localMusicFiles));
    }
    dispatch(tour2Actions.setPointsIncreaseRate(localPointsIncreaseRate));
    dispatch(tour4Actions.setTour4InitialTimer(localInitialTimer));
    dispatch(appActions.setMaxPianoNotes(localMaxPianoNotes));
  }, []);

  useEffect(() => {
    console.log('=== SAVE TOUR 1 ===');
    setTour1(tour1);
  }, [tour1]);

  useEffect(() => {
    console.log('=== SAVE TOUR 2 ===');
    setTour2(tour2);
  }, [tour2]);

  useEffect(() => {
    console.log('=== SAVE TOUR 3 ===');
    setTour3(tour3);
  }, [tour3]);

  useEffect(() => {
    console.log('=== SAVE TOUR 4 ===');
    setTour4(tour4);
  }, [tour4]);

  useEffect(() => {
    console.log('=== SAVE MUSIC ===');
    setMusicFiles(musicFiles);
  }, [musicFiles]);

  const loadAssetsPath = () => {
    window.electron.ipcRenderer.sendMessage('get-assets-path', []);
    window.electron.ipcRenderer.once('get-assets-path', (arg) => {
      const assetsPath: string = arg[0];
      dispatch(appActions.setAssetsPath(assetsPath));
    });
  };

  return (
    <>
      <Notification />
      <Router
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/editgame" element={<EditGamePage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
