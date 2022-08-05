import { Button, Textbox } from 'components';
import SelectButton from 'components/SelectButton/SelectButton';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useNavigate } from 'react-router-dom';
import MusicTable from './MusicTable/MusicTable';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './EditGamePage.module.css';
import { useEffect, useState } from 'react';
import { setNumberIncrementSpeedAction } from 'store/reducers/SecondTourSlice';
import { tours } from 'constants/app';
import { ITour } from 'models/ITour';
import FirstTourTable from './FirstTourTable/FirstTourTable';
import SecondTourTable from './SecondTourTable/SecondTourTable';
import FourthTourTable from './FourthTourTable/FourthTourTable';
import EditQuestionModal from './EditQuestionModal/EditQuestionModal';
import { setFourthTourInitialTimerAction } from 'store/reducers/FourthTourSlice';
import { setActiveTourIdAction } from 'store/reducers/AppSlice';
import ThirdTourTable from './ThirdTourTable/ThirdTourTable';
import PianoModal from './PianoModal/PianoModal';
import ImageModal from './ImageModal/ImageModal';

const EditGamePage = () => {
  const [activeTourId, setActiveTourId] = useState<number>(1);

  const numberIncrementSpeed = useAppSelector(
    (state) => state.secondTour.numberIncrementSpeed
  );
  const initialTimer = useAppSelector((state) => state.fourthTour.initialTimer);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('activeTourId', '1');
  }, []);

  const selectTour = (tour: ITour) => {
    setActiveTourId(tour.id);
    localStorage.setItem('activeTourId', tour.id.toString());
  };

  const numberIncrementSpeedChange = (speed: number) => {
    dispatch(setNumberIncrementSpeedAction(speed));
  };

  const initialTimerChange = (timer: number) => {
    dispatch(setFourthTourInitialTimerAction(timer));
  };

  const renderTable = () => {
    if (activeTourId === 1) {
      return <FirstTourTable />;
    } else if (activeTourId === 2) {
      return <SecondTourTable />;
    } else if (activeTourId === 3) {
      return <ThirdTourTable />;
    } else {
      return <FourthTourTable />;
    }
  };

  const back = () => {
    dispatch(setActiveTourIdAction(1));
    navigate('/');
  };

  return (
    <div>
      <EditQuestionModal />
      <PianoModal />
      <ImageModal />
      <div className={styles.container}>
        <div className={styles.header}>
          <Button style={{ width: 'max-content' }} onClick={back}>
            Назад
          </Button>
          <SelectButton
            items={tours}
            defaultSelectedItem={tours[0]}
            changeHandler={selectTour}
          />
          {activeTourId === 2 && (
            <Textbox
              label="Скорость увеличения очков (мс)"
              type="number"
              style={{ width: '300px' }}
              min={100}
              value={numberIncrementSpeed}
              onChange={(e) =>
                numberIncrementSpeedChange(Number(e.target.value))
              }
            />
          )}
          {activeTourId === 4 && (
            <Textbox
              label="Таймер (сек)"
              type="number"
              style={{ width: '300px' }}
              min={1}
              max={99}
              value={initialTimer}
              onChange={(e) => initialTimerChange(Number(e.target.value))}
            />
          )}
        </div>
        <DndProvider backend={HTML5Backend}>
          {renderTable()}
          {activeTourId !== 3 && (
            <div className={styles.music_container}>
              <MusicTable />
            </div>
          )}
        </DndProvider>
      </div>
    </div>
  );
};

export default EditGamePage;
