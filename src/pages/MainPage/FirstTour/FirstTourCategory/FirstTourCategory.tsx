import { useAppSelector } from 'hooks/redux';
import { ICategory } from 'models/ICategory';
import { FC } from 'react';
import styles from './FirstTourCategory.module.css';

interface FirstTourCategoryProps {
  category: ICategory;
}

const FirstTourCategory: FC<FirstTourCategoryProps> = ({ category }) => {
  const firstTourActiveCategoryId = useAppSelector(
    (state) => state.firstTour.firstTourActiveCategoryId
  );

  return (
    <div
      className={styles.text_container}
      style={
        firstTourActiveCategoryId === category.id
          ? { backgroundColor: '#ffea83' }
          : {}
      }
    >
      <span className={styles.text}>{category.name}</span>
    </div>
  );
};

export default FirstTourCategory;
