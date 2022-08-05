import { useAppSelector } from 'hooks/redux';
import { ICategory } from 'models/ICategory';
import { FC } from 'react';
import styles from './SecondTourCategory.module.css';

interface SecondTourCategoryProps {
  category: ICategory;
}

const SecondTourCategory: FC<SecondTourCategoryProps> = ({ category }) => {
  const secondTourActiveCategoryId = useAppSelector(
    (state) => state.secondTour.secondTourActiveCategoryId
  );

  return (
    <div
      className={styles.text_container}
      style={
        secondTourActiveCategoryId === category.id
          ? { backgroundColor: '#ffea83' }
          : {}
      }
    >
      <span className={styles.text}>{category.name}</span>
    </div>
  );
};

export default SecondTourCategory;
