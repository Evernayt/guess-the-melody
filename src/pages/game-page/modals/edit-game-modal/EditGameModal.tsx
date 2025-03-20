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
import { useNavigate } from 'react-router-dom';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { tour2Actions } from 'store/reducers/Tour2Slice';

const EditGameModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.editGameModal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeModal = () => {
    dispatch(modalActions.closeModal('editGameModal'));
  };

  const openEditGamePage = () => {
    navigate('/editGame');
    dispatch(tour1Actions.setActiveCategoryId(0));
    dispatch(tour1Actions.setActiveNoteId(0));
    dispatch(tour2Actions.setActiveCategoryId(0));
    dispatch(tour2Actions.setActiveNoteId(0));
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактировать игру</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Все активные ноты будут деактивированы, продолжить?</Text>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button colorScheme="purple" onClick={openEditGamePage}>
              Да
            </Button>
            <Button onClick={closeModal}>Нет</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditGameModal;
