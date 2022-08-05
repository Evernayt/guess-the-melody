import { Button } from 'components';
import { createClone } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFirstTour } from 'models/IFirstTour';
import { MusicTypes } from 'models/IMusic';
import { setFirstTourAction } from 'store/reducers/FirtsTourSlice';
import { openEditQuestionModalAction } from 'store/reducers/ModalSlice';
import FirstTourMusicItem from './FirstTourMusicItem/FirstTourMusicItem';
import styles from './FirstTourTable.module.css';

const FirstTourTable = () => {
  const firstTour = useAppSelector((state) => state.firstTour.firstTour);

  const dispatch = useAppDispatch();

  const categoryChangeHandler = (text: string, categoryIndex: number) => {
    const firstTourClone: IFirstTour = createClone(firstTour);
    const newCategories = firstTourClone.categories;
    newCategories[categoryIndex].name = text;
    const newFirstTour: IFirstTour = {
      tourId: firstTourClone.tourId,
      categories: newCategories,
    };

    dispatch(setFirstTourAction(newFirstTour));
  };

  const noteChangeHandler = (
    number: number,
    categoryIndex: number,
    noteIndex: number
  ) => {
    const firstTourClone: IFirstTour = createClone(firstTour);
    const newCategories = firstTourClone.categories;
    newCategories[categoryIndex].notes[noteIndex].number = number;
    const newFirstTour: IFirstTour = {
      tourId: firstTourClone.tourId,
      categories: newCategories,
    };

    dispatch(setFirstTourAction(newFirstTour));
  };

  const openEditQuestionModal = (categoryIndex: number, noteIndex: number) => {
    dispatch(openEditQuestionModalAction({ categoryIndex, noteIndex }));
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
        {firstTour.categories.map((category, categoryIndex) => (
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
                    <FirstTourMusicItem
                      music={note.backingTrack}
                      musicType={MusicTypes.backingTrack}
                      categoryIndex={categoryIndex}
                      noteIndex={noteIndex}
                    />
                  </div>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Оригинал:</div>
                    <FirstTourMusicItem
                      music={note.original}
                      musicType={MusicTypes.original}
                      categoryIndex={categoryIndex}
                      noteIndex={noteIndex}
                    />
                  </div>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Вопрос:</div>
                    <Button
                      style={{
                        height: '24px',
                        padding: 0,
                        borderRadius: '4px',
                      }}
                      onClick={() =>
                        openEditQuestionModal(categoryIndex, noteIndex)
                      }
                    >
                      {note.doubleSharp ? 'Есть' : 'Добавить'}
                    </Button>
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

export default FirstTourTable;
