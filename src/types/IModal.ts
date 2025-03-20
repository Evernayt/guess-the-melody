import { IDoubleSharp } from './INote';

export interface IModal {
  isOpen: boolean;
}

export interface IEditQuestionModal extends IModal {
  categoryIndex?: number;
  noteIndex?: number;
}

export interface IMelodyHintModal extends IModal {
  musicThemeIndex?: number;
}

export interface IPianoModal extends IModal {
  musicThemeIndex?: number;
}

export interface IQuestionModal extends IModal {
  doubleSharp?: IDoubleSharp;
}
