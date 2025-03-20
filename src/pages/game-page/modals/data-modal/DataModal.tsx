import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import {
  IconDatabaseExport,
  IconDatabaseImport,
  IconDatabaseX,
} from '@tabler/icons-react';
import { FileUploader, Loader } from 'components';
import {
  getInitialTimer,
  getMaxPianoNotes,
  getMusicFiles,
  getPointsIncreaseRate,
  getTour1,
  getTour2,
  getTour3,
  getTour4,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { tour2Actions } from 'store/reducers/Tour2Slice';
import { tour3Actions } from 'store/reducers/Tour3Slice';
import { tour4Actions } from 'store/reducers/Tour4Slice';

const DataModal = () => {
  const [message, setMessage] = useState<string>('');
  const [isImport, setIsImport] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen } = useAppSelector((state) => state.modal.dataModal);

  const dispatch = useAppDispatch();

  const openResetDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'resetDataModal' }));
    closeModal();
  };

  const getTime = (): string => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const importData = (files: FileList) => {
    setIsLoading(true);

    window.electron.ipcRenderer.sendMessage('import-data', [files[0].path]);
    window.electron.ipcRenderer.once('import-data', (arg) => {
      if (arg[1] !== null) {
        const data = arg[1];

        dispatch(tour1Actions.setTour1(data.tour1));
        dispatch(tour2Actions.setTour2(data.tour2));
        dispatch(tour3Actions.setTour3(data.tour3));
        dispatch(tour4Actions.setTour4(data.tour4));
        dispatch(appActions.setMusicFiles(data.musicFiles));
        dispatch(tour2Actions.setPointsIncreaseRate(data.pointsIncreaseRate));
        dispatch(tour4Actions.setTour4InitialTimer(data.initialTimer));
        dispatch(appActions.setMaxPianoNotes(data.localMaxPianoNotes));

        setMessage(`${getTime()} - ${arg[0]}`);
      } else {
        setMessage(`${getTime()} - Не удалось импортировать!`);
      }

      setIsImport(false);
      setIsLoading(false);
    });
  };

  const exportData = () => {
    const tour1 = getTour1();
    const tour2 = getTour2();
    const tour3 = getTour3();
    const tour4 = getTour4();
    const musicFiles = getMusicFiles();
    const pointsIncreaseRate = getPointsIncreaseRate();
    const initialTimer = getInitialTimer();
    const localMaxPianoNotes = getMaxPianoNotes();

    const data = JSON.stringify({
      tour1,
      tour2,
      tour3,
      tour4,
      musicFiles,
      pointsIncreaseRate,
      initialTimer,
      localMaxPianoNotes,
    });

    window.electron.ipcRenderer.sendMessage('export-data', [data]);
    window.electron.ipcRenderer.once('export-data', (arg) => {
      setMessage(`${getTime()} - ${arg[0]}`);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('dataModal'));
    importMessageClear();
  };

  const importMessage = () => {
    setIsImport(true);
    setMessage(
      'Необходимо выбрать файл data.json в папке GuessTheMelody DATA.\nИмпорт удалит все старые данные. Продолжить?',
    );
  };

  const importMessageClear = () => {
    setIsImport(false);
    setMessage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Данные</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Loader />
          ) : (
            message !== '' && <Text whiteSpace="pre-line">{message}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          {!isLoading && (
            <>
              {isImport ? (
                <HStack>
                  <FileUploader
                    colorScheme="purple"
                    accept=".json"
                    onFileUpload={importData}
                  >
                    Да
                  </FileUploader>
                  <Button onClick={importMessageClear}>Нет</Button>
                </HStack>
              ) : (
                <HStack>
                  <Button
                    leftIcon={<IconDatabaseExport size={20} />}
                    colorScheme="purple"
                    onClick={exportData}
                  >
                    Экспорт
                  </Button>
                  <Button
                    leftIcon={<IconDatabaseImport size={20} />}
                    onClick={importMessage}
                  >
                    Импорт
                  </Button>
                  <Button
                    leftIcon={<IconDatabaseX size={20} />}
                    colorScheme="red"
                    onClick={openResetDataModal}
                  >
                    Удалить
                  </Button>
                </HStack>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DataModal;
