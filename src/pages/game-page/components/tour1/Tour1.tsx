import { Center, Grid } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/redux';
import { Fragment } from 'react/jsx-runtime';
import { Category } from 'components';
import Tour1Note from './Tour1Note';

const Tour1 = () => {
  const tour1 = useAppSelector((state) => state.tour1.tour1);
  const activeCategoryId = useAppSelector(
    (state) => state.tour1.activeCategoryId,
  );

  return (
    <Grid
      templateRows="repeat(4, 1fr)"
      templateColumns="30vw repeat(4, auto)"
      gap={4}
    >
      {tour1.categories.map((category) => (
        <Fragment key={category.id}>
          <Category category={category} activeCategoryId={activeCategoryId} />
          {category.notes.map((note) => (
            <Center key={note.id}>
              <Tour1Note note={note} categoryId={category.id} />
            </Center>
          ))}
        </Fragment>
      ))}
    </Grid>
  );
};

export default Tour1;
