import IMAGES from 'constants/images';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/redux';
import Tour1 from './components/tour1/Tour1';
import GameHeader from './components/game-header/GameHeader';
import GameTours from './components/game-tours/GameTours';
import EditGameModal from './modals/edit-game-modal/EditGameModal';
import QuestionModal from './modals/question-modal/QuestionModal';
import Tour2 from './components/tour2/Tour2';
import Tour3 from './components/tour3/Tour3';
import Tour4 from './components/tour4/Tour4';
import DataModal from './modals/data-modal/DataModal';
import ResetDataModal from './modals/reset-data-modal/ResetDataModal';

const GamePage = () => {
  const activeTour = useAppSelector((state) => state.app.activeTour);

  const renderActiveTour = () => {
    switch (activeTour) {
      case 1:
        return <Tour1 />;
      case 2:
        return <Tour2 />;
      case 3:
        return <Tour3 />;
      case 4:
        return <Tour4 />;
      default:
        return null;
    }
  };

  return (
    <>
      <EditGameModal />
      <QuestionModal />
      <DataModal />
      <ResetDataModal />
      <Box
        h="100vh"
        bgSize="cover"
        bgPos="center"
        style={{
          backgroundImage: `linear-gradient(rgba(50, 5, 100, 0.8), 
        rgba(50, 5, 100, 0.8)), 
        url(${IMAGES.bg})`,
        }}
      >
        <Grid templateRows="50px 1fr" templateColumns="50px 1fr" p={4}>
          <GridItem colSpan={2}>
            <GameHeader />
          </GridItem>
          <GameTours />
          {renderActiveTour()}
        </Grid>
      </Box>
    </>
  );
};

export default GamePage;
