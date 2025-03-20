import { ChangeEvent, FC, ReactNode, useRef } from 'react';
import { ButtonProps, Button } from '@chakra-ui/react';

interface FileUploaderProps extends ButtonProps {
  children: ReactNode;
  onFileUpload?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUploader: FC<FileUploaderProps> = ({
  children,
  onFileUpload,
  accept,
  multiple,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current!.value = '';
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && onFileUpload) {
      onFileUpload(event.target.files);
    }
    event.target.value = '';
  };

  return (
    <>
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={accept}
        multiple={multiple}
        onChange={onChangeHandler}
      />
    </>
  );
};

export default FileUploader;
