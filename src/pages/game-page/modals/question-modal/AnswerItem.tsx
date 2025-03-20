import { IAnswer } from 'types/INote';
import { FC, useState } from 'react';
import { Button } from '@chakra-ui/react';

interface AnswerItemProps {
  answer: IAnswer;
  answerIndex: number;
}

enum AnswerStatuses {
  correctAnswer = 'green',
  wrongAnswer = 'red',
  notSelectedAnswer = 'gray',
}

const AnswerItem: FC<AnswerItemProps> = ({ answer, answerIndex }) => {
  const [answerStatus, setAnswerStatus] = useState<AnswerStatuses>(
    AnswerStatuses.notSelectedAnswer,
  );

  const checkAnswerCorrectness = () => {
    if (answer.isTrue) {
      setAnswerStatus(AnswerStatuses.correctAnswer);
    } else {
      setAnswerStatus(AnswerStatuses.wrongAnswer);
    }
  };

  return (
    <Button
      colorScheme={answerStatus}
      w="100%"
      justifyContent="left"
      textAlign="left"
      whiteSpace="wrap"
      fontSize="3xl"
      mb={2}
      p={3}
      h="auto"
      onClick={checkAnswerCorrectness}
    >{`${answerIndex + 1}. ${answer.answer}`}</Button>
  );
};

export default AnswerItem;
