import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { setErrorAction } from 'store/reducers/AppSlice';
import styles from './Footer.module.css';

const Footer = () => {
  const error = useAppSelector((state) => state.app.error);

  const dispatch = useAppDispatch();

  const clearError = () => {
    dispatch(setErrorAction(''));
  };

  return (
    <div className={styles.container}>
      {error !== '' && (
        <span className={styles.error} onClick={clearError}>
          Ошибка: {error}
        </span>
      )}
    </div>
  );
};

export default Footer;
