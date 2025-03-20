import { Center, Grid } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/redux';
import Tour2Note from './Tour2Note';
import { Fragment } from 'react/jsx-runtime';
import { Category } from 'components';

const Tour2 = () => {
  const tour2 = useAppSelector((state) => state.tour2.tour2);
  const activeCategoryId = useAppSelector(
    (state) => state.tour2.activeCategoryId,
  );

  return (
    <Grid
      templateRows="repeat(4, 1fr)"
      templateColumns="30vw repeat(4, auto)"
      gap={4}
    >
      {tour2.categories.map((category, categoryIndex) => (
        <Fragment key={category.id}>
          <Category category={category} activeCategoryId={activeCategoryId} />
          {category.notes.map((note, noteIndex) => (
            <Center key={note.id}>
              <Tour2Note
                note={note}
                categoryId={category.id}
                categoryIndex={categoryIndex}
                noteIndex={noteIndex}
              />
            </Center>
          ))}
        </Fragment>
      ))}
    </Grid>
  );
};

export default Tour2;
