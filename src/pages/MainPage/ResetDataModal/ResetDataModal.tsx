import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { closeResetDataModalAction } from 'store/reducers/ModalSlice';
import styles from './ResetDataModal.module.css';

const ResetDataModal = () => {
  const resetDataModal = useAppSelector((state) => state.modal.resetDataModal);

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(closeResetDataModalAction());
  };

  const resetData = () => {
    localStorage.clear();
    window.electron.ipcRenderer.sendMessage('clear-music', []);
    window.electron.ipcRenderer.sendMessage('clear-images', []);
    close();
    window.location.reload();
  };

  return (
    <Modal
      title="Удалить данные"
      isShowing={resetDataModal.isShowing}
      hide={close}
    >
      <div>Все данные будут удалены, продолжить?</div>
      <div className={styles.controls}>
        <Button variant={ButtonVariants.primary} onClick={close}>
          Нет
        </Button>
        <Button onClick={resetData}>Да</Button>
      </div>
    </Modal>
  );
};

export default ResetDataModal;
