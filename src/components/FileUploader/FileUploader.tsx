import Button, { ButtonVariants } from 'components/Button/Button';
import { ChangeEvent, FC, HTMLAttributes, useRef } from 'react';
import styles from './FileUploader.module.css';

interface FileUploaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ButtonVariants;
  changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

const FileUploader: FC<FileUploaderProps> = ({
  variant = ButtonVariants.default,
  changeHandler,
  accept,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current!.value = '';
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    changeHandler(event);
  };

  return (
    <div {...props}>
      <Button
        variant={variant}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleClick}
      >
        <span className={styles.text}>Выберите изображение</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onChangeHandler}
        accept={accept}
      />
    </div>
  );
};

// const IconButton = ({ appearance = 'default', icon, children, ...props }) => {
//   return (
//     <button className={`icon-button-${appearance}`} {...props}>
//       <img
//         className="icon-button-img"
//         style={
//           children === undefined ? { marginRight: 0 } : { marginRight: '8px' }
//         }
//         src={icon}
//         alt=""
//       />
//       {children}
//     </button>
//   );
// };

export default FileUploader;
