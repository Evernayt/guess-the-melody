import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import MusicItem from '../../music-item/MusicItem';
import { IMusic, MusicVariants } from 'types/IMusic';
import { IDragItem } from 'types/IDragItem';
import { DropTargets, IDropResult } from 'types/IDropResult';
import { getTour4 } from 'helpers/localStorage';
import { appActions } from 'store/reducers/AppSlice';
import { tour4Actions } from 'store/reducers/Tour4Slice';

const Tour4Table = () => {
  const tour4 = useAppSelector((state) => state.tour4.tour4);

  const dispatch = useAppDispatch();

  const musicDragEnd = (
    dragItem: IDragItem,
    dropResult: IDropResult | null,
  ) => {
    if (!dragItem || !dropResult) return;
    const { sevenNoteIndex: dsni } = dragItem;
    const { target, sevenNoteIndex: sni } = dropResult;
    const tour4Clone = getTour4();
    if (!tour4Clone) return;
    const sevenNotes = tour4Clone.sevenNotes;
    let oldMusic: IMusic | null = null;

    if (dsni === undefined) return;

    if (target === DropTargets.editTable) {
      if (sni === undefined) return;
      oldMusic = sevenNotes[sni].backingTrack;
      sevenNotes[sni].backingTrack = sevenNotes[dsni].backingTrack;
    } else {
      oldMusic = sevenNotes[dsni].backingTrack;
    }
    sevenNotes[dsni].backingTrack = null;
    dispatch(tour4Actions.setTour4(tour4Clone));

    if (oldMusic) {
      dispatch(appActions.setMusicPending({ ...oldMusic, isPending: true }));
    }
  };

  return (
    <TableContainer>
      <Table layout="fixed">
        <Thead>
          <Tr>
            <Th>№</Th>
            <Th>Мелодия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tour4.sevenNotes.map((sevenNote, index) => (
            <Tr key={sevenNote.id}>
              <Td>{sevenNote.id}</Td>
              <Td>
                <MusicItem
                  music={sevenNote.backingTrack}
                  musicVariant={MusicVariants.backingTrack}
                  sevenNoteIndex={index}
                  onDragEnd={musicDragEnd}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Tour4Table;
