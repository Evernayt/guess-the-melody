import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useNavigate } from 'react-router-dom';
import {
  setFirstTourActiveCategoryIdAction,
  setFirstTourActiveNoteIdAction,
} from 'store/reducers/FirtsTourSlice';
import { closeEditGameModalAction } from 'store/reducers/ModalSlice';
import {
  setSecondTourActiveCategoryIdAction,
  setSecondTourActiveNoteIdAction,
} from 'store/reducers/SecondTourSlice';

const EditGameModal = () => {
  const editGameModal = useAppSelector((state) => state.modal.editGameModal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const close = () => {
    dispatch(closeEditGameModalAction());
  };

  const openEditGamePage = () => {
    navigate('/editGame');
    dispatch(setFirstTourActiveCategoryIdAction(0));
    dispatch(setFirstTourActiveNoteIdAction(0));
    dispatch(setSecondTourActiveCategoryIdAction(0));
    dispatch(setSecondTourActiveNoteIdAction(0));
    close();
  };

  return (
    <Modal
      title="Редактировать игру"
      isShowing={editGameModal.isShowing}
      hide={close}
    >
      <div>Все активные ноты будут деактивированы, продолжить?</div>
      <Button
        variant={ButtonVariants.primary}
        style={{ marginTop: '12px' }}
        onClick={openEditGamePage}
      >
        Продолжить
      </Button>
    </Modal>
  );
};

export default EditGameModal;
