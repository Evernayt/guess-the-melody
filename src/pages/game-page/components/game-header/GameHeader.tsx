import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceSdCard,
  IconSettings,
} from '@tabler/icons-react';
import { VolumeSlider } from 'components';
import { useAppDispatch } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import NotePlayer from './NotePlayer';

const GameHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  const openEditGameModal = () => {
    dispatch(modalActions.openModal({ modal: 'editGameModal' }));
  };

  const openDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'dataModal' }));
  };

  return (
    <Flex gap={4}>
      <IconButton
        icon={
          isMenuOpen ? (
            <IconChevronLeft size={20} />
          ) : (
            <IconChevronRight size={20} />
          )
        }
        aria-label="menu"
        colorScheme="purple"
        onClick={() => setIsMenuOpen((prevState) => !prevState)}
      />
      {isMenuOpen && (
        <HStack>
          <Button
            leftIcon={<IconSettings size={20} />}
            colorScheme="purple"
            onClick={openEditGameModal}
          >
            Редактировать игру
          </Button>
          <Button
            leftIcon={<IconDeviceSdCard size={20} />}
            colorScheme="purple"
            onClick={openDataModal}
          >
            Данные
          </Button>
          <Box h={5} ml={2} mr={2}>
            <Divider orientation="vertical" />
          </Box>
          <VolumeSlider />
        </HStack>
      )}
      <NotePlayer />
    </Flex>
  );
};

export default GameHeader;
