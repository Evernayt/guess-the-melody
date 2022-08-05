import Button from 'components/Button/Button';
import SelectButton from 'components/SelectButton/SelectButton';
import { tours } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITour } from 'models/ITour';
import { useState } from 'react';
import {
  setActiveTourIdAction,
  setVolumeAction,
} from 'store/reducers/AppSlice';
import {
  setFirstTourActiveCategoryIdAction,
  setFirstTourActiveNoteIdAction,
} from 'store/reducers/FirtsTourSlice';
import {
  openDataModalAction,
  openEditGameModalAction,
} from 'store/reducers/ModalSlice';
import {
  setSecondTourActiveCategoryIdAction,
  setSecondTourActiveNoteIdAction,
  setSecondTourIntervalAction,
} from 'store/reducers/SecondTourSlice';
import styles from './Header.module.css';

const Header = () => {
  const [menuIsShowing, setMenuIsShowing] = useState<boolean>(true);

  const volume = useAppSelector((state) => state.app.volume);
  const secondTourInterval = useAppSelector(
    (state) => state.secondTour.secondTourInterval
  );

  const dispatch = useAppDispatch();

  const selectTour = (tour: ITour) => {
    dispatch(setActiveTourIdAction(tour.id));

    if (tour.id === 2) {
      dispatch(setSecondTourActiveCategoryIdAction(0));
      dispatch(setSecondTourActiveNoteIdAction(0));

      let categoryId = 1;

      const secondTourInterval = setInterval(() => {
        const noteId = Number(`${categoryId}1`);

        dispatch(setSecondTourActiveCategoryIdAction(categoryId));
        dispatch(setSecondTourActiveNoteIdAction(noteId));

        categoryId === 4 ? (categoryId = 1) : categoryId++;
      }, 500);

      dispatch(setSecondTourIntervalAction(secondTourInterval));
    } else {
      dispatch(setFirstTourActiveCategoryIdAction(0));
      dispatch(setFirstTourActiveNoteIdAction(0));

      if (secondTourInterval) {
        clearInterval(secondTourInterval);
      }
    }
  };

  const openEditGameModal = () => {
    dispatch(openEditGameModalAction());
  };

  const openDataModal = () => {
    dispatch(openDataModalAction());
  };

  return (
    <div className={styles.header}>
      <Button
        style={{ width: 'max-content' }}
        onClick={() => setMenuIsShowing((prevState) => !prevState)}
      >
        ☰
      </Button>
      {menuIsShowing && (
        <div className={styles.menu}>
          <SelectButton
            items={tours}
            defaultSelectedItem={tours[0]}
            changeHandler={selectTour}
          />
          <Button
            style={{ width: 'max-content' }}
            onClick={openEditGameModal}
          >
            Редактировать игру
          </Button>
          <Button style={{ width: 'max-content' }} onClick={openDataModal}>
            Данные
          </Button>
          <input
            className={styles.volume_range}
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => dispatch(setVolumeAction(Number(e.target.value)))}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
