import { useAppSelector } from 'hooks/redux';
import { MusicTypes } from 'models/IMusic';
import FourthTourMusicItem from './FourthTourMusicItem/FourthTourMusicItem';
import styles from './FourthTourTable.module.css';

const FourthTourTable = () => {
  const fourthTour = useAppSelector((state) => state.fourthTour.fourthTour);

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td style={{ height: 'auto' }}>№</td>
          <td style={{ height: 'auto' }}>Мелодия</td>
        </tr>
        {fourthTour.sevenNotes.map((sevenNote, index) => (
          <tr key={sevenNote.id}>
            <td>{sevenNote.id}</td>
            <td>
              <FourthTourMusicItem
                music={sevenNote.backingTrack}
                musicType={MusicTypes.backingTrack}
                sevenNoteIndex={index}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FourthTourTable;
