import {
  Button,
  Center,
  NumberInput,
  NumberInputField,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import MusicItem from '../../music-item/MusicItem';
import { IMusic, MusicVariants } from 'types/IMusic';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { useCallback } from 'react';
import { debounce } from 'helpers';
import { IDragItem } from 'types/IDragItem';
import { DropTargets, IDropResult } from 'types/IDropResult';
import { appActions } from 'store/reducers/AppSlice';
import { getTour1 } from 'helpers/localStorage';
import { modalActions } from 'store/reducers/ModalSlice';

const Tour1Table = () => {
  const tour1 = useAppSelector((state) => state.tour1.tour1);

  const dispatch = useAppDispatch();

  const musicDragEnd = (
    dragItem: IDragItem,
    dropResult: IDropResult | null,
  ) => {
    if (!dragItem || !dropResult) return;

    const { musicVariant: dmv, categoryIndex: dci, noteIndex: dni } = dragItem;
    const {
      target,
      musicVariant: mv,
      categoryIndex: ci,
      noteIndex: ni,
    } = dropResult;

    const tour1Clone = getTour1();
    if (!tour1Clone) return;

    const categories = tour1Clone.categories;
    let oldMusic: IMusic | null = null;

    if (dci === undefined || dni === undefined) return;

    if (target === DropTargets.editTable) {
      if (ci === undefined || ni === undefined) return;

      const oldNotes = structuredClone(categories[ci].notes[ni]);

      oldMusic = oldNotes[mv];
      categories[ci].notes[ni][mv] = categories[dci].notes[dni][dmv];
    } else {
      oldMusic = categories[dci].notes[dni][dmv];
    }

    categories[dci].notes[dni][dmv] = null;

    dispatch(tour1Actions.setTour1(tour1Clone));

    if (oldMusic) {
      dispatch(appActions.setMusicPending({ ...oldMusic, isPending: true }));
    }
  };

  const categoryChangeHandler = useCallback(
    debounce((text: string, categoryIndex: number) => {
      const tour1Clone = structuredClone(tour1);

      tour1Clone.categories[categoryIndex].name = text;
      dispatch(tour1Actions.setTour1(tour1Clone));
    }, 300),
    [tour1, dispatch],
  );

  const notePointsChangeHandler = useCallback(
    debounce((points: number, categoryIndex: number, noteIndex: number) => {
      const tour1Clone = structuredClone(tour1);

      tour1Clone.categories[categoryIndex].notes[noteIndex].points = points;
      dispatch(tour1Actions.setTour1(tour1Clone));
    }, 300),
    [tour1, dispatch],
  );

  const originalStartTimeChangeHandler = useCallback(
    debounce(
      (originalStartTime: number, categoryIndex: number, noteIndex: number) => {
        const tour1Clone = structuredClone(tour1);

        tour1Clone.categories[categoryIndex].notes[
          noteIndex
        ].originalStartTime = originalStartTime;
        dispatch(tour1Actions.setTour1(tour1Clone));
      },
      300,
    ),
    [tour1, dispatch],
  );

  const openEditQuestionModal = (categoryIndex: number, noteIndex: number) => {
    dispatch(
      modalActions.openModal({
        modal: 'editQuestionModal',
        props: { categoryIndex, noteIndex },
      }),
    );
  };

  return (
    <TableContainer>
      <Table layout="fixed">
        <Thead>
          <Tr>
            <Th>Тема</Th>
            <Th>Первая нота</Th>
            <Th>Вторая нота</Th>
            <Th>Третья нота</Th>
            <Th>Четвертая нота</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tour1.categories.map((category, categoryIndex) => (
            <Tr key={category.id}>
              <Td>
                <Textarea
                  fontWeight="medium"
                  variant="unstyled"
                  defaultValue={category.name}
                  resize="none"
                  onChange={(e) =>
                    categoryChangeHandler(e.target.value, categoryIndex)
                  }
                />
              </Td>
              {category.notes.map((note, noteIndex) => (
                <Td key={note.id}>
                  <VStack gap={1}>
                    <Center gap={1} justifyContent="start" w="100%">
                      <Text fontSize="xs">Очки:</Text>
                      <NumberInput
                        variant="unstyled"
                        min={0}
                        defaultValue={note.points}
                        onChange={(_, number) =>
                          number >= 0 &&
                          notePointsChangeHandler(
                            number,
                            categoryIndex,
                            noteIndex,
                          )
                        }
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Center>
                    <Center gap={1} justifyContent="start" w="100%">
                      <Text fontSize="xs">Минус:</Text>
                      <MusicItem
                        music={note.backingTrack}
                        musicVariant={MusicVariants.backingTrack}
                        categoryIndex={categoryIndex}
                        noteIndex={noteIndex}
                        onDragEnd={musicDragEnd}
                      />
                    </Center>
                    <Center gap={1} justifyContent="start" w="100%">
                      <Text fontSize="xs">Оригинал:</Text>
                      <MusicItem
                        music={note.original}
                        musicVariant={MusicVariants.original}
                        categoryIndex={categoryIndex}
                        noteIndex={noteIndex}
                        onDragEnd={musicDragEnd}
                      />
                    </Center>
                    <Center gap={1} justifyContent="start" w="100%">
                      <Text fontSize="xs">Начать с сек.:</Text>
                      <NumberInput
                        variant="unstyled"
                        min={0}
                        defaultValue={note.originalStartTime}
                        onChange={(_, number) =>
                          number >= 0 &&
                          originalStartTimeChangeHandler(
                            number,
                            categoryIndex,
                            noteIndex,
                          )
                        }
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Center>
                    <Center gap={1} justifyContent="start" w="100%">
                      <Text fontSize="xs">Вопрос:</Text>
                      <Button
                        size="xs"
                        onClick={() =>
                          openEditQuestionModal(categoryIndex, noteIndex)
                        }
                      >
                        {note.doubleSharp ? 'Есть' : 'Добавить'}
                      </Button>
                    </Center>
                  </VStack>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Tour1Table;
