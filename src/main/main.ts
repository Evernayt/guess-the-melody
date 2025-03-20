/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { IMusic } from 'types/IMusic';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 768,
    icon: getAssetPath('icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

async function emptyDir(dir: string): Promise<void> {
  try {
    const files = await fs.readdir(dir);

    const deletePromises = files.map(async (file) => {
      const filePath = path.join(dir, file);

      try {
        await fs.unlink(filePath);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    });

    await Promise.all(deletePromises);
  } catch (error: any) {
    console.error('Ошибка при очистке директории:', error.message);
  }
}

async function copyFileWithSuffix(
  source: string,
  destination: string,
): Promise<string> {
  const destDir = path.dirname(destination);
  const fileName = path.basename(destination);
  const fileExt = path.extname(fileName);
  const baseName = path.basename(fileName, fileExt);

  let newFileName = fileName;
  let counter = 1;

  while (true) {
    try {
      await fs.access(path.join(destDir, newFileName));
      newFileName = `${baseName} (${counter})${fileExt}`;
      counter++;
    } catch (err) {
      break;
    }
  }

  const finalDestination = path.join(destDir, newFileName);

  try {
    await fs.copyFile(source, finalDestination);
    return newFileName;
  } catch (err) {
    return '';
  }
}

/**
 * Add event listeners...
 */

ipcMain.on('get-assets-path', async (event) => {
  event.reply('get-assets-path', [RESOURCES_PATH]);
});

ipcMain.on('copy-music', async (event, arg) => {
  const filePaths: string[] = arg[0];
  const musicFiles: IMusic[] = [];

  try {
    for (const filePath of filePaths) {
      const id = uuidv4();
      const name = path.basename(filePath);
      const absolutePath = getAssetPath(path.join('music', name));

      const newFileName = await copyFileWithSuffix(filePath, absolutePath);

      const relativePath = path.join('music', newFileName);
      musicFiles.push({ id, name: newFileName, relativePath, isPending: true });
    }

    event.reply('copy-music', [musicFiles]);
  } catch (error) {
    event.reply('notification', [
      'Ошибка копирования музыки',
      `${error}`,
      'error',
    ]);
  }
});

ipcMain.on('remove-music', async (event, arg) => {
  const relativePath: string = arg[0];
  const absolutePath = getAssetPath(relativePath);

  try {
    await fs.unlink(absolutePath);
    event.reply('remove-music', []);
  } catch (error) {
    event.reply('notification', [
      'Ошибка удаления музыки',
      `${error}`,
      'error',
    ]);
  }
});

ipcMain.on('copy-image', async (event, arg) => {
  const imagePath: string = arg[0];

  try {
    const name = path.basename(imagePath);
    const absolutePath = getAssetPath(path.join('question_images', name));

    const newFileName = await copyFileWithSuffix(imagePath, absolutePath);
    const relativePath = path.join('question_images', newFileName);

    event.reply('copy-image', [relativePath]);
  } catch (error) {
    event.reply('notification', [
      'Ошибка копирования изображения',
      `${error}`,
      'error',
    ]);
  }
});

ipcMain.on('remove-image', async (event, arg) => {
  const relativePath: string = arg[0];
  const absolutePath = getAssetPath(relativePath);

  try {
    await fs.unlink(absolutePath);
    event.reply('remove-image', []);
  } catch (error) {
    event.reply('notification', [
      'Ошибка удаления изображения',
      `${error}`,
      'error',
    ]);
  }
});

ipcMain.on('clear-images', async (event) => {
  const absoluteImagesPath = getAssetPath('question_images');

  try {
    await emptyDir(absoluteImagesPath);
    event.reply('clear-images', []);
  } catch (error) {
    event.reply('notification', [
      'Ошибка удаления изображениий',
      `${error}`,
      'error',
    ]);
  }
});

ipcMain.on('export-data', async (event, arg) => {
  const data = arg[0];

  const absoluteMusicPath = getAssetPath('music');
  const absoluteImagesPath = getAssetPath('question_images');

  const destFolder = os.homedir() + '/Desktop/GuessTheMelody DATA';
  const destFile = os.homedir() + '/Desktop/GuessTheMelody DATA/data.json';

  try {
    await fs.mkdir(destFolder);
    await fs.cp(absoluteImagesPath, destFolder + '/question_images', {
      recursive: true,
    });
    await fs.cp(absoluteMusicPath, destFolder + '/music', { recursive: true });
    await fs.writeFile(destFile, data);
    event.reply('export-data', ['Экспортировано на рабочий стол.', data]);
  } catch (error) {
    event.reply('export-data', [`Ошибка экспорта: ${error}`]);
  }
});

ipcMain.on('import-data', async (event, arg) => {
  const jsonPath = arg[0];
  const musicFolder = jsonPath.replace('data.json', 'music');
  const imagesFolder = jsonPath.replace('data.json', 'question_images');

  const absoluteMusicPath = getAssetPath('music');
  const absoluteImagesPath = getAssetPath('question_images');

  try {
    await emptyDir(absoluteImagesPath);
    await fs.cp(imagesFolder, absoluteImagesPath, { recursive: true });

    await emptyDir(absoluteMusicPath);
    await fs.cp(musicFolder, absoluteMusicPath, { recursive: true });

    const file = await fs.readFile(jsonPath, { encoding: 'utf8' });
    const data = JSON.parse(file);
    event.reply('import-data', ['Импортировано', data]);
  } catch (error) {
    event.reply('import-data', [`Ошибка импорта: ${error}`, null]);
  }
});

ipcMain.on('clear-music', async (event) => {
  const absoluteMusicPath = getAssetPath('music');

  await emptyDir(absoluteMusicPath);
  event.reply('clear-music', []);
});

ipcMain.on('open-musics-folder', async () => {
  const absoluteMusicPath = getAssetPath('music');
  shell.openPath(absoluteMusicPath);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
