import { Footer, Header } from 'components';
import { BG } from 'constants/images';
import { useAppSelector } from 'hooks/redux';
import DataModal from './DataModal/DataModal';
import EditGameModal from './EditGameModal/EditGameModal';
import FirstTour from './FirstTour/FirstTour';
import SecondTour from './SecondTour/SecondTour';
import FourthTour from './FourthTour/FourthTour';
import ResetDataModal from './ResetDataModal/ResetDataModal';
import styles from './MainPage.module.css';
import QuestionModal from './QuestionModal/QuestionModal';
import ThirdTour from './ThirdTour/ThirdTour';

const MainPage = () => {
  const activeTourId = useAppSelector((state) => state.app.activeTourId);

  const renderActiveTour = () => {
    if (activeTourId === 1) {
      return <FirstTour />;
    } else if (activeTourId === 2) {
      return <SecondTour />;
    } else if (activeTourId === 3) {
      return <ThirdTour />;
    } else {
      return <FourthTour />;
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `linear-gradient(rgba(50, 5, 100, 0.3), rgba(50, 5, 100, 0.3)), url(${BG})`,
      }}
    >
      <QuestionModal />
      <ResetDataModal />
      <DataModal />
      <EditGameModal />
      <Header />
      {renderActiveTour()}
      <Footer />
    </div>
  );
};

export default MainPage;
