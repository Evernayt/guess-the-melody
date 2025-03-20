import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Image,
  Center,
  VStack,
  Text,
  Tooltip,
  Box,
  Button,
} from '@chakra-ui/react';
import { IconPhoto, IconPhotoPlus } from '@tabler/icons-react';
import { ButtonWithConfirm, FileUploader } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour3Actions } from 'store/reducers/Tour3Slice';

const MelodyHintModal = () => {
  const [imagePath, setImagePath] = useState<string>('');

  const { isOpen, musicThemeIndex } = useAppSelector(
    (state) => state.modal.melodyHintModal,
  );
  const tour3 = useAppSelector((state) => state.tour3.tour3);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && musicThemeIndex !== undefined) {
      const relativePath = tour3.musicThemes[musicThemeIndex].imagePath;

      if (relativePath !== '') {
        const absolutePath = `${assetsPath}\\${relativePath}`;
        setImagePath(absolutePath);
      }
    } else {
      setImagePath('');
    }
  }, [isOpen]);

  const closeModal = () => {
    if (musicThemeIndex !== undefined) {
      const oldRelativePath = tour3.musicThemes[musicThemeIndex].imagePath;
      const oldAbsolutePath = `${assetsPath}\\${oldRelativePath}`;

      if (imagePath !== '' && imagePath !== oldAbsolutePath) {
        if (oldRelativePath !== '') {
          removeImage(oldRelativePath);
        }
        save();
      }
    }

    dispatch(modalActions.closeModal('melodyHintModal'));
  };

  const save = () => {
    if (musicThemeIndex === undefined) return;

    window.electron.ipcRenderer.sendMessage('copy-image', [imagePath]);
    window.electron.ipcRenderer.once('copy-image', (arg) => {
      const relativePath: string = arg[0];
      const musicThemesClone = structuredClone(tour3.musicThemes);
      musicThemesClone[musicThemeIndex].imagePath = relativePath;
      dispatch(tour3Actions.setMusicThemes(musicThemesClone));
    });
  };

  const removeImage = (path: string) => {
    if (musicThemeIndex === undefined) return;

    const relativePath = path.replace(`${assetsPath}\\`, '');

    if (relativePath !== '') {
      window.electron.ipcRenderer.sendMessage('remove-image', [relativePath]);
      window.electron.ipcRenderer.once('remove-image', () => {
        setImagePath('');
        const musicThemesClone = structuredClone(tour3.musicThemes);
        musicThemesClone[musicThemeIndex].imagePath = '';
        dispatch(tour3Actions.setMusicThemes(musicThemesClone));
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Подсказка для мелодии</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            {imagePath === '' ? (
              <VStack>
                <IconPhoto color="gray" />
                <Text color="gray" fontWeight="500">
                  Изображение не добавлено
                </Text>
              </VStack>
            ) : (
              <Image src={imagePath} maxH="70vh" />
            )}
          </Center>
        </ModalBody>
        <ModalFooter>
          <HStack>
            {imagePath ? (
              <ButtonWithConfirm
                title="Удалить изображение"
                onConfirm={() => removeImage(imagePath)}
              />
            ) : (
              <Tooltip
                label="Рекомендуемый размер: 1920х1080 пикс."
                placement="left"
                hasArrow
                openDelay={800}
              >
                <Box>
                  <FileUploader
                    leftIcon={<IconPhotoPlus size={20} />}
                    accept="image/*"
                    colorScheme="purple"
                    onFileUpload={(files) => setImagePath(files[0].path)}
                  >
                    Добавить изображение
                  </FileUploader>
                </Box>
              </Tooltip>
            )}
            <Button onClick={closeModal}>Закрыть</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MelodyHintModal;
