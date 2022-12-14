import { CircleButton } from 'components';
import close2Icon from './close-2-icon.svg';
import { FC, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  isShowing: boolean;
  hide: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({
  title,
  isShowing,
  hide,
  children,
  ...props
}) => {
  return isShowing ? (
    <div className={styles.container}>
      <div className={styles.form_container} {...props}>
        <div className={styles.form_header}>
          <span className={styles.form_header_title}>{title}</span>
          <CircleButton
            icon={close2Icon}
            style={{
              height: '36px',
              width: '36px',
              marginLeft: '12px',
            }}
            onClick={hide}
          />
        </div>
        <div className={styles.separator} />
        <div className={styles.form}>{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
