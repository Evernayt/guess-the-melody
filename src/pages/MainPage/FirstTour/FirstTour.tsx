import { useAppSelector } from 'hooks/redux';
import { ICategory } from 'models/ICategory';
import styles from './FirstTour.module.css';
import FirstTourCategory from './FirstTourCategory/FirstTourCategory';
import FirstTourNote from './FirstTourNote/FirstTourNote';

const FirstTour = () => {
  const firstTour = useAppSelector((state) => state.firstTour.firstTour);

  return (
    <div className={styles.game_container}>
      <div className={styles.column_1}>
        {firstTour.categories.map((category: ICategory) => (
          <FirstTourCategory category={category} key={category.id} />
        ))}
      </div>
      <div className={styles.column_2}>
        {firstTour.categories.map((category: ICategory) => {
          return (
            <div className={styles.note_container} key={category.id}>
              {category.notes.map((note) => (
                <FirstTourNote note={note} category={category} key={note.id} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FirstTour;
