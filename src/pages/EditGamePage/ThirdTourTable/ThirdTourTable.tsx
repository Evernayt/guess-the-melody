import { Button } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  openImageModalAction,
  openPianoModalAction,
} from 'store/reducers/ModalSlice';
import styles from './ThirdTourTable.module.css';

const ThirdTourTable = () => {
  const thirdTour = useAppSelector((state) => state.thirdTour.thirdTour);

  const dispatch = useAppDispatch();

  const openPianoModal = (index: number) => {
    dispatch(openPianoModalAction(index));
  };

  const openImageModal = (index: number) => {
    dispatch(openImageModalAction(index));
  };

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td style={{ height: 'auto' }}>№</td>
          <td style={{ height: 'auto' }}>Вопрос</td>
          <td style={{ height: 'auto' }}>Ноты</td>
        </tr>
        {thirdTour.musicThemes.map((musicTheme, index) => (
          <tr key={musicTheme.id}>
            <td>{musicTheme.id}</td>
            <td>
              <Button
                style={{
                  height: '24px',
                  padding: 0,
                  borderRadius: '4px',
                }}
                onClick={() => openImageModal(index)}
              >
                {thirdTour.musicThemes[index].image !== ''
                  ? 'Есть'
                  : 'Добавить'}
              </Button>
            </td>
            <td>
              <Button
                style={{
                  height: '24px',
                  padding: 0,
                  borderRadius: '4px',
                }}
                onClick={() => openPianoModal(index)}
              >
                {thirdTour.musicThemes[index].pianoNotes.length > 0
                  ? 'Есть'
                  : 'Добавить'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ThirdTourTable;
