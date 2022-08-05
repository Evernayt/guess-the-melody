import { createClone } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { MusicTypes } from 'models/IMusic';
import { ISecondTour } from 'models/ISecondTour';
import { setSecondTourAction } from 'store/reducers/SecondTourSlice';
import styles from './SecondTourTable.module.css';
import SecondTourMusicItem from './SecondTourMusicItem/SecondTourMusicItem';

const SecondTourTable = () => {
  const secondTour = useAppSelector((state) => state.secondTour.secondTour);

  const dispatch = useAppDispatch();

  const categoryChangeHandler = (text: string, categoryIndex: number) => {
    const secondTourClone: ISecondTour = createClone(secondTour);
    const newCategories = secondTourClone.categories;
    newCategories[categoryIndex].name = text;
    const newSecondTour: ISecondTour = {
      tourId: secondTourClone.tourId,
      categories: newCategories,
    };

    dispatch(setSecondTourAction(newSecondTour));
  };

  const noteChangeHandler = (
    number: number,
    categoryIndex: number,
    noteIndex: number
  ) => {
    const secondTourClone: ISecondTour = createClone(secondTour);
    const newCategories = secondTourClone.categories;
    newCategories[categoryIndex].notes[noteIndex].number = number;
    const newSecondTour: ISecondTour = {
      tourId: secondTourClone.tourId,
      categories: newCategories,
    };

    dispatch(setSecondTourAction(newSecondTour));
  };

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td style={{ height: 'auto' }}>Тема</td>
          <td style={{ height: 'auto' }}>Первая нота</td>
          <td style={{ height: 'auto' }}>Вторая нота</td>
          <td style={{ height: 'auto' }}>Третья нота</td>
          <td style={{ height: 'auto' }}>Четвертая нота</td>
        </tr>
        {secondTour.categories.map((category, categoryIndex) => (
          <tr key={category.id}>
            <td>
              <input
                className={[styles.text_input, styles.text_input_title].join(
                  ' '
                )}
                value={category.name}
                onChange={(e) =>
                  categoryChangeHandler(e.target.value, categoryIndex)
                }
              />
            </td>
            {category.notes.map((note, noteIndex) => (
              <td key={note.id}>
                <div className={styles.music_container}>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Очки:</div>
                    <input
                      className={styles.text_input}
                      type="number"
                      min={0}
                      value={note.number}
                      onChange={(e) =>
                        noteChangeHandler(
                          Number(e.target.value),
                          categoryIndex,
                          noteIndex
                        )
                      }
                    />
                  </div>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Минусовка:</div>
                    <SecondTourMusicItem
                      music={note.backingTrack}
                      musicType={MusicTypes.backingTrack}
                      categoryIndex={categoryIndex}
                      noteIndex={noteIndex}
                    />
                  </div>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Оригинал:</div>
                    <SecondTourMusicItem
                      music={note.original}
                      musicType={MusicTypes.original}
                      categoryIndex={categoryIndex}
                      noteIndex={noteIndex}
                    />
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SecondTourTable;
