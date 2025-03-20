import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import AnswerItem from './AnswerItem';
import { modalActions } from 'store/reducers/ModalSlice';
import IMAGES from 'constants/images';

const QuestionModal = () => {
  const { isOpen, doubleSharp } = useAppSelector(
    (state) => state.modal.questionModal,
  );

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(modalActions.closeModal('questionModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
      <ModalOverlay />
      <ModalContent
        bgSize="cover"
        bgPos="center"
        bgImage={`url(${IMAGES.question_bg})`}
      >
        <ModalHeader color="white" fontSize="4xl">
          {doubleSharp?.question}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          {doubleSharp?.answers.map((answer, index) => (
            <AnswerItem answer={answer} answerIndex={index} key={answer.id} />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal;
