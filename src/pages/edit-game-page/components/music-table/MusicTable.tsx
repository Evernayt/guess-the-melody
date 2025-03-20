import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { IconFolder, IconMusicPlus, IconMusicUp } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useDrop } from 'react-dnd';
import { appActions } from 'store/reducers/AppSlice';
import { DropTargets, IDropResult } from 'types/IDropResult';
import { IMusic, MusicVariants } from 'types/IMusic';
import MusicFile from './MusicFile';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { getTour1, getTour2, getTour4 } from 'helpers/localStorage';
import { tour2Actions } from 'store/reducers/Tour2Slice';
import { FileUploader } from 'components';
import { tour4Actions } from 'store/reducers/Tour4Slice';

const MusicTable = () => {
  const musicFiles = useAppSelector((state) => state.app.musicFiles);
  const editingTour = useAppSelector((state) => state.app.editingTour);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let musicNum = 0;

  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'music',
    drop: () => ({
      target: DropTargets.musicTable,
      musicVariant: MusicVariants.backingTrack, // заглушка
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const musicDragEnd = (dragItem: IMusic, dropResult: IDropResult | null) => {
    onOpen();
    if (!dragItem || !dropResult) return;

    const {
      musicVariant: mv,
      categoryIndex: ci,
      noteIndex: ni,
      sevenNoteIndex: sni,
    } = dropResult;

    let oldMusic: IMusic | null = null;

    if (editingTour === 1) {
      if (ci === undefined || ni === undefined) return;

      const tour1Clone = getTour1();
      if (!tour1Clone) return;

      const categories = tour1Clone.categories;

      oldMusic = categories[ci].notes[ni][mv];
      categories[ci].notes[ni][mv] = dragItem;

      dispatch(tour1Actions.setTour1(tour1Clone));
    } else if (editingTour === 2) {
      if (ci === undefined || ni === undefined) return;

      const tour2Clone = getTour2();
      if (!tour2Clone) return;

      const categories = tour2Clone.categories;

      oldMusic = categories[ci].notes[ni][mv];
      categories[ci].notes[ni][mv] = dragItem;

      dispatch(tour2Actions.setTour2(tour2Clone));
    } else if (editingTour === 4) {
      if (sni === undefined) return;

      const tour4Clone = getTour4();
      if (!tour4Clone) return;

      const sevenNotes = tour4Clone.sevenNotes;

      oldMusic = sevenNotes[sni].backingTrack;
      sevenNotes[sni].backingTrack = dragItem;

      dispatch(tour4Actions.setTour4(tour4Clone));
    }

    dispatch(appActions.setMusicPending({ ...dragItem, isPending: false }));
    if (oldMusic) {
      dispatch(appActions.setMusicPending({ ...oldMusic, isPending: true }));
    }
  };

  const addMusic = (files: FileList) => {
    const filePaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      filePaths.push(files[i].path);
    }

    window.electron.ipcRenderer.sendMessage('copy-music', [filePaths]);
    window.electron.ipcRenderer.once('copy-music', (arg) => {
      const newMusicFiles: IMusic[] = arg[0];
      dispatch(appActions.addMusicFiles(newMusicFiles));
    });
  };

  const openMusicsFolder = () => {
    window.electron.ipcRenderer.sendMessage('open-musics-folder');
  };

  // D&D STYLES
  const isActiveDnd = canDrop && isOver;
  let dndItemBgColor = '';
  let dndItemIcon = <IconMusicUp size={20} />;
  if (isActiveDnd) {
    dndItemBgColor = 'purple.200';
    dndItemIcon = <IconMusicPlus size={20} />;
  } else if (canDrop) {
    dndItemBgColor = 'purple.100';
    dndItemIcon = <IconMusicPlus size={20} />;
  }

  return (
    <Center>
      <Button
        leftIcon={dndItemIcon}
        ref={drop}
        bgColor={dndItemBgColor}
        variant="ghost"
        onClick={onOpen}
      >
        Список музыки
      </Button>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Center justifyContent="space-between">
              Список музыки
              <HStack>
                <Button
                  leftIcon={<IconFolder size={20} />}
                  onClick={openMusicsFolder}
                >
                  Папка с музыкой
                </Button>
                <FileUploader
                  leftIcon={<IconMusicPlus size={20} />}
                  accept="audio/*"
                  multiple
                  colorScheme="purple"
                  onFileUpload={addMusic}
                >
                  Добавить
                </FileUploader>
              </HStack>
            </Center>
          </DrawerHeader>
          <DrawerBody p="0 8px 16px 8px">
            {musicFiles.map((music) => {
              if (music.isPending) {
                musicNum++;
                return (
                  <MusicFile
                    music={music}
                    num={musicNum}
                    onDragStart={onClose}
                    onDragEnd={musicDragEnd}
                    key={music.id}
                  />
                );
              } else {
                return null;
              }
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Center>
  );
};

export default MusicTable;
