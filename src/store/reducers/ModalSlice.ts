import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IModal } from 'models/IModal';
import { IDoubleSharp } from 'models/INote';

export interface IQuestionModal {
  isShowing: boolean;
  doubleSharp: IDoubleSharp | null;
}

export interface IEditQuestionModal {
  isShowing: boolean;
  categoryIndex: number;
  noteIndex: number;
}

export interface IThirdTourModal {
  isShowing: boolean;
  musicThemeIndex: number;
}

const initialModal: IModal = { isShowing: false };
const initialEditQuestionModal: IEditQuestionModal = {
  isShowing: false,
  categoryIndex: 0,
  noteIndex: 0,
};
const initialQuestionModal: IQuestionModal = {
  isShowing: false,
  doubleSharp: null,
};
const initialThirdTourModal: IThirdTourModal = {
  isShowing: false,
  musicThemeIndex: -1,
};

type ModalState = {
  editGameModal: IModal;
  dataModal: IModal;
  resetDataModal: IModal;
  questionModal: IQuestionModal;
  editQuestionModal: IEditQuestionModal;
  pianoModal: IThirdTourModal;
  imageModal: IThirdTourModal;
};

const initialState: ModalState = {
  editGameModal: initialModal,
  dataModal: initialModal,
  resetDataModal: initialModal,
  questionModal: initialQuestionModal,
  editQuestionModal: initialEditQuestionModal,
  pianoModal: initialThirdTourModal,
  imageModal: initialThirdTourModal,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openEditGameModalAction(state) {
      state.editGameModal.isShowing = true;
    },
    closeEditGameModalAction(state) {
      state.editGameModal.isShowing = false;
    },
    openDataModalAction(state) {
      state.dataModal.isShowing = true;
    },
    closeDataModalAction(state) {
      state.dataModal.isShowing = false;
    },
    openResetDataModalAction(state) {
      state.resetDataModal.isShowing = true;
    },
    closeResetDataModalAction(state) {
      state.resetDataModal.isShowing = false;
    },
    openQuestionModalAction(state, action: PayloadAction<IDoubleSharp | null>) {
      state.questionModal.isShowing = true;
      state.questionModal.doubleSharp = action.payload;
    },
    closeQuestionModalAction(state) {
      state.questionModal.isShowing = false;
      state.questionModal.doubleSharp = null;
    },
    openEditQuestionModalAction(
      state,
      action: PayloadAction<{ categoryIndex: number; noteIndex: number }>
    ) {
      state.editQuestionModal.isShowing = true;
      state.editQuestionModal.categoryIndex = action.payload.categoryIndex;
      state.editQuestionModal.noteIndex = action.payload.noteIndex;
    },
    closeEditQuestionModalAction(state) {
      state.editQuestionModal.isShowing = false;
    },
    openPianoModalAction(state, action: PayloadAction<number>) {
      state.pianoModal.isShowing = true;
      state.pianoModal.musicThemeIndex = action.payload;
    },
    closePianoModalAction(state) {
      state.pianoModal.isShowing = false;
      state.pianoModal.musicThemeIndex = -1;
    },
    openImageModalAction(state, action: PayloadAction<number>) {
      state.imageModal.isShowing = true;
      state.imageModal.musicThemeIndex = action.payload;
    },
    closeImageModalAction(state) {
      state.imageModal.isShowing = false;
      state.imageModal.musicThemeIndex = -1;
    },
  },
});

export const {
  openEditGameModalAction,
  closeEditGameModalAction,
  openDataModalAction,
  closeDataModalAction,
  openResetDataModalAction,
  closeResetDataModalAction,
  openQuestionModalAction,
  closeQuestionModalAction,
  openEditQuestionModalAction,
  closeEditQuestionModalAction,
  openPianoModalAction,
  closePianoModalAction,
  openImageModalAction,
  closeImageModalAction,
} = modalSlice.actions;

export default modalSlice.reducer;
