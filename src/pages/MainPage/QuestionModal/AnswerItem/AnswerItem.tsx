import { IAnswer } from 'models/INote';
import { FC, useState } from 'react';
import styles from './AnswerItem.module.css';

interface AnswerItemProps {
  answer: IAnswer;
  answerIndex: number;
}

enum AnswerStatuses {
  correctAnswer = 'correct_answer',
  wrongAnswer = 'wrong_answer',
  notSelectedAnswer = 'not_selected_answer',
}

const AnswerItem: FC<AnswerItemProps> = ({ answer, answerIndex }) => {
  const [answerStatus, setAnswerStatus] = useState<AnswerStatuses>(
    AnswerStatuses.notSelectedAnswer
  );

  const checkAnswerCorrectness = () => {
    if (answer.isTrue) {
      setAnswerStatus(AnswerStatuses.correctAnswer);
    } else {
      setAnswerStatus(AnswerStatuses.wrongAnswer);
    }
  };

  return (
    <div className={styles[answerStatus]} onClick={checkAnswerCorrectness}>{`${
      answerIndex + 1
    }. ${answer.answer}`}</div>
  );
};

export default AnswerItem;
