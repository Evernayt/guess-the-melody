import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  Button,
  IconButton,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import {
  IconCheck,
  IconHelpOctagon,
  IconTrashX,
  IconX,
} from '@tabler/icons-react';
import { ButtonWithConfirm } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import { tour1Actions } from 'store/reducers/Tour1Slice';
import { IAnswer, IDoubleSharp } from 'types/INote';
import { v4 as uuidv4 } from 'uuid';

const EditQuestionModal = () => {
  const [isQuestionCreated, setIsQuestionCreated] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  const {
    isOpen,
    categoryIndex: ci,
    noteIndex: ni,
  } = useAppSelector((state) => state.modal.editQuestionModal);
  const tour1 = useAppSelector((state) => state.tour1.tour1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      if (ci === undefined || ni === undefined) return;

      const doubleSharp = tour1.categories[ci].notes[ni].doubleSharp;
      if (!doubleSharp) {
        setIsQuestionCreated(false);
        setQuestion('');
        setAnswers([]);
      } else {
        setIsQuestionCreated(true);
        setQuestion(doubleSharp.question);
        setAnswers(doubleSharp.answers);
      }
    }
  }, [isOpen]);

  const closeModal = () => {
    if (isQuestionCreated) save();
    dispatch(modalActions.closeModal('editQuestionModal'));
  };

  const createQuestion = () => {
    if (ci === undefined || ni === undefined) return;

    const newDoubleSharp: IDoubleSharp = {
      question,
      answers: [],
    };

    dispatch(
      tour1Actions.setDoubleSharp({
        categoryIndex: ci,
        noteIndex: ni,
        doubleSharp: newDoubleSharp,
      }),
    );

    setIsQuestionCreated(true);
  };

  const removeQuestion = () => {
    if (ci === undefined || ni === undefined) return;

    dispatch(
      tour1Actions.setDoubleSharp({
        categoryIndex: ci,
        noteIndex: ni,
        doubleSharp: null,
      }),
    );
    setIsQuestionCreated(false);
    dispatch(modalActions.closeModal('editQuestionModal'));
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
        answer.id === id ? { ...answer, isTrue: !answer.isTrue } : answer,
      ),
    );
  };

  const answerChangeHandler = (id: string, text: string) => {
    setAnswers((prevState) =>
      prevState.map((state) =>
        state.id === id ? { ...state, answer: text } : state,
      ),
    );
  };

  const save = () => {
    if (ci === undefined || ni === undefined) return;

    const newDoubleSharp: IDoubleSharp = {
      question,
      answers,
    };
    dispatch(
      tour1Actions.setDoubleSharp({
        categoryIndex: ci,
        noteIndex: ni,
        doubleSharp: newDoubleSharp,
      }),
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Вопрос</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            {isQuestionCreated ? (
              <InputGroup>
                <InputLeftAddon>Тема вопроса</InputLeftAddon>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </InputGroup>
            ) : (
              <VStack>
                <IconHelpOctagon color="gray" />
                <Text color="gray" fontWeight="500">
                  Вопрос не создан
                </Text>
              </VStack>
            )}
            {answers.map((answer, index) => (
              <HStack align="start" w="100%" key={answer.id}>
                <Tooltip
                  label={answer.isTrue ? 'Правильный' : 'Не правильный'}
                  placement="left"
                  hasArrow
                >
                  <IconButton
                    icon={
                      answer.isTrue ? (
                        <IconCheck size={20} />
                      ) : (
                        <IconX size={20} />
                      )
                    }
                    aria-label="check"
                    colorScheme={answer.isTrue ? 'green' : 'red'}
                    onClick={() => aswerTrueToggle(answer.id)}
                  />
                </Tooltip>
                <InputGroup>
                  <InputLeftAddon>{`Ответ №${index + 1}`}</InputLeftAddon>
                  <Input
                    value={answer.answer}
                    onChange={(e) =>
                      answerChangeHandler(answer.id, e.target.value)
                    }
                  />
                </InputGroup>
                <IconButton
                  icon={<IconTrashX size={18} color="gray" />}
                  aria-label="remove"
                  variant="ghost"
                  isRound
                  onClick={() => removeAnswer(answer.id)}
                />
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {!isQuestionCreated ? (
            <Button colorScheme="purple" onClick={createQuestion}>
              Создать вопрос
            </Button>
          ) : (
            <HStack>
              <Button colorScheme="purple" onClick={addAnswer}>
                Добавить ответ
              </Button>
              <ButtonWithConfirm
                title="Удалить вопрос"
                onConfirm={removeQuestion}
              />
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditQuestionModal;
