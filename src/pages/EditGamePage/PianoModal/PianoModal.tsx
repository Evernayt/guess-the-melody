import { Modal, Piano } from 'components';
import { createClone } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IMusicTheme, IPianoNote } from 'models/IMusicTheme';
import { useEffect, useState } from 'react';
import { closePianoModalAction } from 'store/reducers/ModalSlice';
import { setMusicThemesAction } from 'store/reducers/ThirdTourSlice';

const PianoModal = () => {
  const [pianoNotes, setPianoNotes] = useState<IPianoNote[]>([]);

  const { isShowing, musicThemeIndex } = useAppSelector(
    (state) => state.modal.pianoModal
  );
  const thirdTour = useAppSelector((state) => state.thirdTour.thirdTour);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isShowing) {
      setPianoNotes(thirdTour.musicThemes[musicThemeIndex].pianoNotes);
    } else {
      setPianoNotes([]);
    }
  }, [isShowing]);

  const close = () => {
    const musicThemesClone: IMusicTheme[] = createClone(thirdTour.musicThemes);
    musicThemesClone[musicThemeIndex].pianoNotes = pianoNotes;

    dispatch(setMusicThemesAction(musicThemesClone));
    dispatch(closePianoModalAction());
  };

  return (
    <Modal title="Пианино" isShowing={isShowing} hide={close}>
      <Piano pianoNotes={pianoNotes} setPianoNotes={setPianoNotes} />
    </Modal>
  );
};

export default PianoModal;
