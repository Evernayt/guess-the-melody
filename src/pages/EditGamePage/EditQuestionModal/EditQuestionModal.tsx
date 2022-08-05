import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IAnswer, IDoubleSharp } from 'models/INote';
import { useEffect, useState } from 'react';
import { setFirstTourDoubleSharpAction } from 'store/reducers/FirtsTourSlice';
import { closeEditQuestionModalAction } from 'store/reducers/ModalSlice';
import { v4 as uuidv4 } from 'uuid';
import styles from './EditQuestionModal.module.css';

const EditQuestionModal = () => {
  const [isDoubleSharp, setIsDoubleSharp] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const { isShowing, categoryIndex, noteIndex } = useAppSelector(
    (state) => state.modal.editQuestionModal
  );
  const firstTour = useAppSelector((state) => state.firstTour.firstTour);

  const doubleSharp =
    firstTour.categories[categoryIndex].notes[noteIndex].doubleSharp;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isShowing) {
      if (doubleSharp === undefined || doubleSharp === null) {
        setIsDoubleSharp(false);
        setQuestion('');
        setAnswers([]);
      } else {
        setIsDoubleSharp(true);
        setQuestion(doubleSharp.question);
        setAnswers(doubleSharp.answers);
      }
    }
  }, [isShowing]);

  const close = () => {
    if (isDoubleSharp) {
      save();
    }
    dispatch(closeEditQuestionModalAction());
  };

  const createQuestion = () => {
    const newDoubleSharp: IDoubleSharp = {
      question,
      answers: [],
    };

    dispatch(
      setFirstTourDoubleSharpAction({
        categoryIndex,
        noteIndex,
        doubleSharp: newDoubleSharp,
      })
    );

    setIsDoubleSharp(true);
  };

  const removeQuestion = () => {
    dispatch(
      setFirstTourDoubleSharpAction({
        categoryIndex,
        noteIndex,
        doubleSharp: null,
      })
    );
    setIsDoubleSharp(false);
    dispatch(closeEditQuestionModalAction());
    setIsRemoving(false);
  };

  const addAnswer = () => {
    const answer: IAnswer = {
      id: uuidv4(),
      answer: '',
      isTrue: false,
    };

    setAnswers((prevState) => [...prevState, answer]);
  };

  const removeAnswer = (id: string) => {
    setAnswers((prevState) => prevState.filter((answer) => answer.id !== id));
  };

  const aswerTrueToggle = (id: string) => {
    setAnswers((prevState) =>
      prevState.map((answer) =>
        answer.id === id ? { ...answer, isTrue: !answer.isTrue } : answer
      )
    );
  };

  const answerChangeHandler = (id: string, text: string) => {
    setAnswers((prevState) =>
      prevState.map((state) =>
        state.id === id ? { ...state, answer: text } : state
      )
    );
  };

  const save = () => {
    const newDoubleSharp: IDoubleSharp = {
      question,
      answers,
    };
    dispatch(
      setFirstTourDoubleSharpAction({
        categoryIndex,
        noteIndex,
        doubleSharp: newDoubleSharp,
      })
    );
  };

  return (
    <Modal title="Вопрос" isShowing={isShowing} hide={close}>
      <div className={styles.container}>
        <Textbox
          label="Тема вопроса"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {answers.map((answer, index) => (
          <div className={styles.answer_container} key={answer.id}>
            <Button
              variant={
                answer.isTrue ? ButtonVariants.success : ButtonVariants.default
              }
              style={{ width: 'min-content' }}
              onClick={() => aswerTrueToggle(answer.id)}
            >
              {answer.isTrue ? 'Правильный' : 'Не правильный'}
            </Button>
            <Textbox
              label={`Ответ №${index + 1}`}
              value={answer.answer}
              onChange={(e) => answerChangeHandler(answer.id, e.target.value)}
            />
            <Button
              variant={ButtonVariants.link}
              style={{ width: 'min-content' }}
              onClick={() => removeAnswer(answer.id)}
            >
              Удалить
            </Button>
          </div>
        ))}
        <div className={styles.controls_container}>
          {!isDoubleSharp ? (
            <Button variant={ButtonVariants.primary} onClick={createQuestion}>
              Создать вопрос
            </Button>
          ) : (
            <div className={styles.controls}>
              <Button
                style={{ width: 'min-content' }}
                disabled={isRemoving}
                onClick={() => setIsRemoving(true)}
              >
                {isRemoving ? 'Удалить вопрос?' : 'Удалить вопрос'}
              </Button>
              {!isRemoving ? (
                <Button variant={ButtonVariants.primary} onClick={addAnswer}>
                  Добавить ответ
                </Button>
              ) : (
                <div className={styles.controls}>
                  <Button onClick={removeQuestion}>Да</Button>
                  <Button
                    variant={ButtonVariants.primary}
                    onClick={() => setIsRemoving(false)}
                  >
                    Нет
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;
