import { CSSProperties, FC, InputHTMLAttributes } from 'react';
import styles from './Textbox.module.css';

interface TextboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerStyle?: CSSProperties;
}

const Textbox: FC<TextboxProps> = ({ label, containerStyle, ...props }) => {
  return (
    <div className={styles.container} style={containerStyle}>
      <input className={styles.textbox} {...props} placeholder=" " />
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};

export default Textbox;
