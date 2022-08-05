import { useAppSelector } from 'hooks/redux';
import { FC } from 'react';
import styles from './Category.module.css';

interface CategoryProps {
  id: number;
  index: number;
}

const Category: FC<CategoryProps> = ({ id, index }) => {
  const activeCategoryId = useAppSelector(
    (state) => state.app.activeCategoryId
  );
  const activeTourId = useAppSelector((state) => state.app.activeTourId);
  const firstTour = useAppSelector((state) => state.firstTour.firstTour);
  const secondTour = useAppSelector((state) => state.secondTour.secondTour);

  return (
    <div
      className={styles.text_container}
      style={activeCategoryId === id ? { backgroundColor: '#ffea83' } : {}}
    >
      <span className={styles.text}>
        {activeTourId === 1
          ? firstTour.categories[index].name
          : secondTour.categories[index].name}
      </span>
    </div>
  );
};

export default Category;
