import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';

const ResetDataModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.resetDataModal);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(modalActions.closeModal('resetDataModal'));
  };

  const resetData = () => {
    localStorage.clear();
    window.electron.ipcRenderer.sendMessage('clear-music', []);
    window.electron.ipcRenderer.sendMessage('clear-images', []);
    closeModal();
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Удалить данные</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Все данные будут удалены, продолжить?</Text>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button colorScheme="red" onClick={resetData}>
              Да
            </Button>
            <Button onClick={closeModal}>Нет</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetDataModal;
