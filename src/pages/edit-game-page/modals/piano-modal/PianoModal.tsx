import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Piano } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour3Actions } from 'store/reducers/Tour3Slice';
import { IPianoNote } from 'types/IMusicTheme';

const PianoModal = () => {
  const [pianoNotes, setPianoNotes] = useState<IPianoNote[]>([]);

  const { isOpen, musicThemeIndex } = useAppSelector(
    (state) => state.modal.pianoModal,
  );
  const tour3 = useAppSelector((state) => state.tour3.tour3);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && musicThemeIndex !== undefined) {
      setPianoNotes(tour3.musicThemes[musicThemeIndex].pianoNotes);
    } else {
      setPianoNotes([]);
    }
  }, [isOpen]);

  const closeModal = () => {
    if (musicThemeIndex !== undefined) {
      const musicThemesClone = structuredClone(tour3.musicThemes);
      musicThemesClone[musicThemeIndex].pianoNotes = pianoNotes;
      dispatch(tour3Actions.setMusicThemes(musicThemesClone));
    }

    dispatch(modalActions.closeModal('pianoModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="5xl" motionPreset="none">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Пианино</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Piano pianoNotes={pianoNotes} setPianoNotes={setPianoNotes} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PianoModal;
