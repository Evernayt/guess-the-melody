import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';

const Tour3Table = () => {
  const tour3 = useAppSelector((state) => state.tour3.tour3);

  const dispatch = useAppDispatch();

  const openMelodyHintModal = (musicThemeIndex: number) => {
    dispatch(
      modalActions.openModal({
        modal: 'melodyHintModal',
        props: { musicThemeIndex },
      }),
    );
  };

  const openPianoModal = (musicThemeIndex: number) => {
    dispatch(
      modalActions.openModal({
        modal: 'pianoModal',
        props: { musicThemeIndex },
      }),
    );
  };

  return (
    <TableContainer>
      <Table layout="fixed">
        <Thead>
          <Tr>
            <Th>№</Th>
            <Th>Подсказка для мелодии</Th>
            <Th>Ноты</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tour3.musicThemes.map((musicTheme, index) => (
            <Tr key={musicTheme.id}>
              <Td>{musicTheme.id}</Td>
              <Td>
                <Button size="xs" onClick={() => openMelodyHintModal(index)}>
                  {musicTheme.imagePath !== '' ? 'Есть' : 'Добавить'}
                </Button>
              </Td>
              <Td>
                <Button size="xs" onClick={() => openPianoModal(index)}>
                  {musicTheme.pianoNotes.length > 0 ? 'Есть' : 'Добавить'}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Tour3Table;
