import { createClone } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { MusicTypes } from 'models/IMusic';
import { ITour } from 'models/ITour';
import { FC } from 'react';
import styles from './EditTable.module.css';
import MusicItem from './MusicItem/MusicItem';

interface EditTableProps {
  activeTourIndex: number;
}

const EditTable: FC<EditTableProps> = ({ activeTourIndex }) => {
  const dispatch = useAppDispatch();

  const categoryChangeHandler = (text: string, categoryIndex: number) => {
    const toursClone: ITour[] = createClone(tours);
    const newCategories = toursClone[activeTourIndex].categories;
    newCategories[categoryIndex].name = text;
    const newTour = {
      id: tours[activeTourIndex].id,
      name: tours[activeTourIndex].name,
      categories: newCategories,
    };
    toursClone[activeTourIndex] = newTour;
    dispatch(setToursAction(toursClone));
  };

  const noteChangeHandler = (
    number: number,
    categoryIndex: number,
    noteIndex: number
  ) => {
    const toursClone: ITour[] = createClone(tours);
    const newCategories = toursClone[activeTourIndex].categories;
    newCategories[categoryIndex].notes[noteIndex].number = number;
    const newTour = {
      id: tours[activeTourIndex].id,
      name: tours[activeTourIndex].name,
      categories: newCategories,
    };
    toursClone[activeTourIndex] = newTour;
    dispatch(setToursAction(toursClone));
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
        {tours[activeTourIndex].categories.map((category, categoryIndex) => (
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
                    <MusicItem
                      music={note.backingTrack}
                      musicType={MusicTypes.backingTrack}
                      categoryIndex={categoryIndex}
                      noteIndex={noteIndex}
                    />
                  </div>
                  <div className={styles.music_text_container}>
                    <div className={styles.label_text}>Оригинал:</div>
                    <MusicItem
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

export default EditTable;
