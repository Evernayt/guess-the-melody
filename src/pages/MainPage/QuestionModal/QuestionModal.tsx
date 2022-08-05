import { Button } from 'components';
import { QUESTION_BG } from 'constants/images';
import { useWindowDimensions } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { CSSProperties } from 'react';
import { closeQuestionModalAction } from 'store/reducers/ModalSlice';
import AnswerItem from './AnswerItem/AnswerItem';
import styles from './QuestionModal.module.css';

const bigButtonStyle: CSSProperties = {
  height: '50px',
  padding: '0 40px',
  fontSize: '16px',
  fontWeight: 'bold',
  width: 'min-content',
};

const QuestionModal = () => {
  const { isShowing, doubleSharp } = useAppSelector(
    (state) => state.modal.questionModal
  );

  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions();

  const close = () => {
    dispatch(closeQuestionModalAction());
  };

  return isShowing ? (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${QUESTION_BG})` }}
    >
      <div className={styles.question} style={{ fontSize: `${width / 20}px` }}>
        {doubleSharp?.question}
      </div>
      <div className={styles.answers} style={{ fontSize: `${width / 26}px` }}>
        {doubleSharp?.answers.map((answer, index) => (
          <AnswerItem answer={answer} answerIndex={index} key={answer.id} />
        ))}
      </div>
      <Button style={bigButtonStyle} onClick={close}>
        Закрыть
      </Button>
    </div>
  ) : null;
};

export default QuestionModal;
