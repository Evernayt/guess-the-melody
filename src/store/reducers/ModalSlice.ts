import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_MODAL } from 'constants/initialStates';
import {
  IEditQuestionModal,
  IMelodyHintModal,
  IModal,
  IPianoModal,
  IQuestionModal,
} from 'types/IModal';

type ModalState = {
  /* game-page */
  editGameModal: IModal;
  questionModal: IQuestionModal;
  dataModal: IModal;
  resetDataModal: IModal;
  /* edit-game-page */
  editQuestionModal: IEditQuestionModal;
  melodyHintModal: IMelodyHintModal;
  pianoModal: IPianoModal;
};

const initialState: ModalState = {
  /* game-page */
  editGameModal: INITIAL_MODAL,
  questionModal: INITIAL_MODAL,
  dataModal: INITIAL_MODAL,
  resetDataModal: INITIAL_MODAL,
  /* edit-game-page */
  editQuestionModal: INITIAL_MODAL,
  melodyHintModal: INITIAL_MODAL,
  pianoModal: INITIAL_MODAL,
};

interface OpenModalProps {
  modal: keyof ModalState;
  props?: Partial<ModalState[keyof ModalState]>;
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state: ModalState, action: PayloadAction<OpenModalProps>) {
      state[action.payload.modal] = {
        ...action.payload.props,
        isOpen: true,
      };
    },
    closeModal(state, action: PayloadAction<keyof ModalState>) {
      state[action.payload] = initialState[action.payload];
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
