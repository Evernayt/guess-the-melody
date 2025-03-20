import { FC } from 'react';
import { Center, Text } from '@chakra-ui/react';
import { ICategory } from 'types/ICategory';

interface CategoryProps {
  category: ICategory;
  activeCategoryId: number;
}

const Category: FC<CategoryProps> = ({ category, activeCategoryId }) => {
  return (
    <Center
      borderRadius={6}
      p={4}
      bgColor={activeCategoryId === category.id ? '#ffea83' : '#ECC94B'}
    >
      <Text fontSize="3xl" textAlign="center">
        <b>{category.name}</b>
      </Text>
    </Center>
  );
};

export default Category;
