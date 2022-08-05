import { Button } from 'components';
import { ButtonVariants } from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IMusic, MusicTypes } from 'models/IMusic';
import { useRef } from 'react';
import {
  addMusicFileAction,
  removeMusicFileAction,
} from 'store/reducers/AppSlice';
import MusicFile from './MusicFile/MusicFile';
import { useDrop } from 'react-dnd';
import styles from './MusicTable.module.css';
import { DropTargets } from 'models/IDropResult';

const MusicTable = () => {
  const dispatch = useAppDispatch();

  const musicFiles = useAppSelector((state) => state.app.musicFiles);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'music',
    drop: () => ({
      target: DropTargets.musicTable,
      musicType: MusicTypes.backingTrack, // заглушка
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: any) => {
    const files = [];
    for (let index = 0; index < event.target.files.length; index++) {
      const file = event.target.files[index];
      files.push(file.path);
    }

    event.target.value = null;

    window.electron.ipcRenderer.sendMessage('copy-music', [files]);

    window.electron.ipcRenderer.once('copy-music', (arg) => {
      const newMusicFiles: IMusic[] = arg[0];

      for (let index = 0; index < newMusicFiles.length; index++) {
        dispatch(addMusicFileAction(newMusicFiles[index]));
      }
    });
  };

  const removeMusic = (id: string, path: string) => {
    window.electron.ipcRenderer.sendMessage('remove-music', [path]);

    dispatch(removeMusicFileAction(id));
  };

  const isActive = canDrop && isOver;
  let backgroundColor = 'transparent';
  if (isActive) {
    backgroundColor = '#ffd60a';
  } else if (canDrop) {
    backgroundColor = '#ffea83';
  }

  return (
    <table className={styles.table} style={{ backgroundColor }} ref={drop}>
      <tbody>
        <tr>
          <td style={{ width: '100%', padding: '8px' }}>Музыка</td>
          <td style={{ padding: '4px' }}>
            <Button
              variant={ButtonVariants.primary}
              style={{ width: 'max-content' }}
              onClick={handleClick}
            >
              Добавить
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={onChangeHandler}
              multiple
              accept="audio/*"
            />
          </td>
        </tr>
        {musicFiles.map((music) => {
          if (music.isPending) {
            return (
              <tr key={music.id}>
                <td>
                  <MusicFile music={music} />
                </td>
                <td>
                  <Button
                    variant={ButtonVariants.link}
                    onClick={() => removeMusic(music.id, music.path)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            );
          } else {
            return null;
          }
        })}
      </tbody>
    </table>
  );
};

export default MusicTable;
