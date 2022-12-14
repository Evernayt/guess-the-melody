import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ChangeEvent, useRef, useState } from 'react';
import { setMusicFilesAction } from 'store/reducers/AppSlice';
import { setFirstTourAction } from 'store/reducers/FirtsTourSlice';
import {
  setFourthTourAction,
  setFourthTourInitialTimerAction,
} from 'store/reducers/FourthTourSlice';
import {
  closeDataModalAction,
  openResetDataModalAction,
} from 'store/reducers/ModalSlice';
import {
  setNumberIncrementSpeedAction,
  setSecondTourAction,
} from 'store/reducers/SecondTourSlice';
import { setThirdTourAction } from 'store/reducers/ThirdTourSlice';
import styles from './DataModal.module.css';

const DataModal = () => {
  const [message, setMessage] = useState<string>('');
  const [isImport, setIsImport] = useState<boolean>(false);

  const dataModal = useAppSelector((state) => state.modal.dataModal);

  const dispatch = useAppDispatch();

  const fileRef = useRef<HTMLInputElement>(null);

  const openResetDataModal = () => {
    dispatch(openResetDataModalAction());
    close();
  };

  const getTime = (): string => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const path = e.target.files[0].path;

      window.electron.ipcRenderer.sendMessage('import-data', [path]);

      window.electron.ipcRenderer.once('import-data', (arg) => {
        setMessage(`${getTime()} - ${arg[0]}`);

        if (arg[1] !== null) {
          const data = arg[1];

          const firstTour = JSON.parse(data.firstTour);
          const secondTour = JSON.parse(data.secondTour);
          const thirdTour = JSON.parse(data.thirdTour);
          const fourthTour = JSON.parse(data.fourthTour);
          const music = JSON.parse(data.music);
          const numberIncrementSpeed = JSON.parse(data.numberIncrementSpeed);
          const initialTimer = JSON.parse(data.initialTimer);

          dispatch(setFirstTourAction(firstTour));
          dispatch(setSecondTourAction(secondTour));
          dispatch(setThirdTourAction(thirdTour));
          dispatch(setFourthTourAction(fourthTour));
          dispatch(setMusicFilesAction(music));
          dispatch(setNumberIncrementSpeedAction(numberIncrementSpeed));
          dispatch(setFourthTourInitialTimerAction(initialTimer));
        }

        setIsImport(false);
      });
    }
  };

  const exportData = () => {
    const firstTour = localStorage.getItem('firstTour') || '{}';
    const secondTour = localStorage.getItem('secondTour') || '{}';
    const thirdTour = localStorage.getItem('thirdTour') || '{}';
    const fourthTour = localStorage.getItem('fourthTour') || '{}';
    const music = localStorage.getItem('music') || '[]';
    const numberIncrementSpeed =
      localStorage.getItem('numberIncrementSpeed') || '';
    const initialTimer = localStorage.getItem('initialTimer') || '';

    const data = JSON.stringify({
      firstTour,
      secondTour,
      thirdTour,
      fourthTour,
      music,
      numberIncrementSpeed,
      initialTimer,
    });

    window.electron.ipcRenderer.sendMessage('export-data', [data]);

    window.electron.ipcRenderer.once('export-data', (arg) => {
      setMessage(`${getTime()} - ${arg[0]}`);
    });
  };

  const close = () => {
    dispatch(closeDataModalAction());
    importMessageClear();
  };

  const importMessage = () => {
    setIsImport(true);
    setMessage(
      '???????????????????? ?????????????? ???????? data.json ?? ?????????? GuessTheMelody DATA.\n???????????? ???????????? ?????? ???????????? ????????????. ?????????????????????'
    );
  };

  const importMessageClear = () => {
    setIsImport(false);
    setMessage('');
  };

  return (
    <Modal title="????????????" isShowing={dataModal.isShowing} hide={close}>
      {message !== '' && <div className={styles.message}>{message}</div>}
      {isImport ? (
        <div className={styles.controls}>
          <Button variant={ButtonVariants.primary} onClick={importMessageClear}>
            ??????
          </Button>
          <Button onClick={() => fileRef.current?.click()}>????</Button>
          <input
            ref={fileRef}
            type="file"
            name="name"
            style={{ display: 'none' }}
            accept=".json"
            onChange={(e) => importData(e)}
          />
        </div>
      ) : (
        <div className={styles.controls}>
          <Button onClick={openResetDataModal}>?????????????? ????????????</Button>
          <Button onClick={importMessage}>????????????</Button>
          <Button variant={ButtonVariants.primary} onClick={exportData}>
            ??????????????
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default DataModal;
