import { Card, Grid, GridItem } from '@chakra-ui/react';
import EditGameHeader from './components/edit-game-header/EditGameHeader';
import TourSelect from 'components/tour-select/TourSelect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Tour1Table from './components/tables/tour1-table/Tour1Table';
import MusicTable from './components/music-table/MusicTable';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { appActions } from 'store/reducers/AppSlice';
import EditQuestionModal from './modals/edit-question-modal/EditQuestionModal';
import Tour2Table from './components/tables/tour2-table/Tour2Table';
import Tour3Table from './components/tables/tour3-table/Tour3Table';
import MelodyHintModal from './modals/melody-hint-modal/MelodyHintModal';
import PianoModal from './modals/piano-modal/PianoModal';
import Tour4Table from './components/tables/tour4-table/Tour4Table';

const EditGamePage = () => {
  const editingTour = useAppSelector((state) => state.app.editingTour);

  const dispatch = useAppDispatch();

  const setEditingTour = (tour: number) => {
    dispatch(appActions.setEditingTour(tour));
  };

  const renderTable = () => {
    switch (editingTour) {
      case 1:
        return <Tour1Table />;
      case 2:
        return <Tour2Table />;
      case 3:
        return <Tour3Table />;
      case 4:
        return <Tour4Table />;
      default:
        return null;
    }
  };

  return (
    <>
      <EditQuestionModal />
      <MelodyHintModal />
      <PianoModal />
      <Grid
        templateRows="auto 1fr auto"
        templateColumns="auto 1fr"
        p={4}
        gap={4}
        h="100vh"
      >
        <GridItem colSpan={2}>
          <EditGameHeader />
        </GridItem>
        <TourSelect tour={editingTour} onChange={setEditingTour} />
        <DndProvider backend={HTML5Backend}>
          <Card h="min-content">{renderTable()}</Card>
          <GridItem colSpan={2}>{editingTour !== 3 && <MusicTable />}</GridItem>
        </DndProvider>
      </Grid>
    </>
  );
};

export default EditGamePage;
