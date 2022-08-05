import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { EditGamePage, MainPage } from 'pages';
import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  setAssetsPathAction,
  setMusicFilesAction,
} from 'store/reducers/AppSlice';
import { setFirstTourAction } from 'store/reducers/FirtsTourSlice';
import {
  setFourthTourAction,
  setFourthTourInitialTimerAction,
} from 'store/reducers/FourthTourSlice';
import {
  setNumberIncrementSpeedAction,
  setSecondTourAction,
} from 'store/reducers/SecondTourSlice';
import { setThirdTourAction } from 'store/reducers/ThirdTourSlice';
import './App.css';

const App = () => {
  const firstTour = useAppSelector((state) => state.firstTour.firstTour);
  const secondTour = useAppSelector((state) => state.secondTour.secondTour);
  const thirdTour = useAppSelector((state) => state.thirdTour.thirdTour);
  const fourthTour = useAppSelector((state) => state.fourthTour.fourthTour);
  const musicFiles = useAppSelector((state) => state.app.musicFiles);
  const numberIncrementSpeed = useAppSelector(
    (state) => state.secondTour.numberIncrementSpeed
  );
  const initialTimer = useAppSelector((state) => state.fourthTour.initialTimer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    getAssetsPath();

    const localFirstTour = JSON.parse(
      localStorage.getItem('firstTour') || '{}'
    );
    const localSecondTour = JSON.parse(
      localStorage.getItem('secondTour') || '{}'
    );
    const localThirdTour = JSON.parse(
      localStorage.getItem('thirdTour') || '{}'
    );
    const localFourthTour = JSON.parse(
      localStorage.getItem('fourthTour') || '{}'
    );
    const localMusic = JSON.parse(localStorage.getItem('music') || '[]');
    const localNumberIncrementSpeed = Number(
      localStorage.getItem('numberIncrementSpeed')
    );
    const localInitialTimer = Number(localStorage.getItem('initialTimer'));

    if (Object.keys(localFirstTour).length !== 0) {
      dispatch(setFirstTourAction(localFirstTour));
    }
    if (Object.keys(localSecondTour).length !== 0) {
      dispatch(setSecondTourAction(localSecondTour));
    }
    if (Object.keys(localThirdTour).length !== 0) {
      dispatch(setThirdTourAction(localThirdTour));
    }
    if (Object.keys(localFourthTour).length !== 0) {
      dispatch(setFourthTourAction(localFourthTour));
    }
    if (localMusic.length > 0) {
      dispatch(setMusicFilesAction(localMusic));
    }
    if (localNumberIncrementSpeed > 0) {
      dispatch(setNumberIncrementSpeedAction(localNumberIncrementSpeed));
    }
    if (localInitialTimer > 0) {
      dispatch(setFourthTourInitialTimerAction(localInitialTimer));
    }
  }, []);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE FIRST TOUR');
    console.log('====================================');
    localStorage.setItem('firstTour', JSON.stringify(firstTour));
  }, [firstTour]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE SECOND TOUR');
    console.log('====================================');
    localStorage.setItem('secondTour', JSON.stringify(secondTour));
  }, [secondTour]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE THIRD TOUR');
    console.log('====================================');
    localStorage.setItem('thirdTour', JSON.stringify(thirdTour));
  }, [thirdTour]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE FOURTH TOUR');
    console.log('====================================');
    localStorage.setItem('fourthTour', JSON.stringify(fourthTour));
  }, [fourthTour]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE MUSIC');
    console.log('====================================');
    localStorage.setItem('music', JSON.stringify(musicFiles));
  }, [musicFiles]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE SPEED');
    console.log('====================================');
    localStorage.setItem(
      'numberIncrementSpeed',
      numberIncrementSpeed.toString()
    );
  }, [numberIncrementSpeed]);

  useEffect(() => {
    console.log('====================================');
    console.log('SAVE TIMER');
    console.log('====================================');
    localStorage.setItem('initialTimer', initialTimer.toString());
  }, [initialTimer]);

  const getAssetsPath = () => {
    window.electron.ipcRenderer.sendMessage('get-assets-path', []);

    window.electron.ipcRenderer.once('get-assets-path', (arg) => {
      const assetsPath = arg[0];
      dispatch(setAssetsPathAction(assetsPath));
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/editgame" element={<EditGamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
