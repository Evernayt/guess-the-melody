import { FileUploader, Modal } from 'components';
import Button, { ButtonVariants } from 'components/Button/Button';
import { createClone } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IMusicTheme } from 'models/IMusicTheme';
import { useEffect, useState } from 'react';
import { closeImageModalAction } from 'store/reducers/ModalSlice';
import { setMusicThemesAction } from 'store/reducers/ThirdTourSlice';
import styles from './ImageModal.module.css';

const ImageModal = () => {
  const [imageSrc, setImageSrc] = useState<string>('');

  const { isShowing, musicThemeIndex } = useAppSelector(
    (state) => state.modal.imageModal
  );
  const thirdTour = useAppSelector((state) => state.thirdTour.thirdTour);
  const assetsPath = useAppSelector((state) => state.app.assetsPath);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isShowing) {
      const shortSrc = thirdTour.musicThemes[musicThemeIndex].image;
      if (shortSrc !== '') {
        const src = assetsPath + '\\' + shortSrc;
        setImageSrc(src);
      }
    } else {
      setImageSrc('');
    }
  }, [isShowing]);

  const close = () => {
    const oldShortSrc = thirdTour.musicThemes[musicThemeIndex].image;
    const oldSrc = assetsPath + '\\' + oldShortSrc;

    if (imageSrc !== '' && imageSrc !== oldSrc) {
      if (oldShortSrc !== '') {
        removeImage(oldShortSrc);
      }
      save();
    }

    dispatch(closeImageModalAction());
  };

  const selectImage = (path: string) => {
    setImageSrc(path);
  };

  const save = () => {
    window.electron.ipcRenderer.sendMessage('copy-image', [imageSrc]);

    window.electron.ipcRenderer.once('copy-image', (arg) => {
      const shortPath = arg[0];

      const musicThemesClone: IMusicTheme[] = createClone(
        thirdTour.musicThemes
      );
      musicThemesClone[musicThemeIndex].image = shortPath;

      dispatch(setMusicThemesAction(musicThemesClone));
    });
  };

  const removeImage = (shortSrc: string) => {
    const replacedShortSrc = shortSrc.replace(assetsPath + '\\', '');
    if (replacedShortSrc !== '') {
      window.electron.ipcRenderer.sendMessage('remove-image', [
        replacedShortSrc,
      ]);

      window.electron.ipcRenderer.once('remove-image', () => {
        setImageSrc('');

        const musicThemesClone: IMusicTheme[] = createClone(
          thirdTour.musicThemes
        );
        musicThemesClone[musicThemeIndex].image = '';

        dispatch(setMusicThemesAction(musicThemesClone));
      });
    }
  };

  return (
    <Modal title="Изображение вопроса" isShowing={isShowing} hide={close}>
      <div className={styles.message}>
        Рекомендуемый размер: 1920х1080 пикс.
      </div>
      <div className={styles.controls}>
        <FileUploader
          variant={ButtonVariants.primary}
          changeHandler={(e) => selectImage(e.target.files![0].path)}
          accept="image/*"
        />
        <Button onClick={() => removeImage(imageSrc)}>
          Удалить изображение
        </Button>
      </div>
      <img className={styles.image} src={imageSrc} />
    </Modal>
  );
};

export default ImageModal;
