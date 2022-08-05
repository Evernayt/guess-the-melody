import { useAppSelector } from 'hooks/redux';
import { ICategory } from 'models/ICategory';
import styles from './SecondTour.module.css';
import SecondTourCategory from './SecondTourCategory/SecondTourCategory';
import SecondTourNote from './SecondTourNote/SecondTourNote';

const SecondTour = () => {
  const secondTour = useAppSelector((state) => state.secondTour.secondTour);

  return (
    <div className={styles.game_container}>
      <div className={styles.column_1}>
        {secondTour.categories.map((category: ICategory) => (
          <SecondTourCategory category={category} key={category.id} />
        ))}
      </div>
      <div className={styles.column_2}>
        {secondTour.categories.map(
          (category: ICategory, categoryIndex: number) => {
            return (
              <div className={styles.note_container} key={category.id}>
                {category.notes.map((note, noteIndex) => (
                  <SecondTourNote
                    note={note}
                    category={category}
                    categoryIndex={categoryIndex}
                    noteIndex={noteIndex}
                    key={note.id}
                  />
                ))}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default SecondTour;
