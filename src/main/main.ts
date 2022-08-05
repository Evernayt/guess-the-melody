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
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('get-assets-path', async (event) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  event.reply('get-assets-path', [RESOURCES_PATH]);
});

ipcMain.on('copy-music', async (event, arg) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const files = arg[0];
  const musicFiles = [];

  for (let index = 0; index < files.length; index++) {
    const srcPath = files[index];

    const id = uuidv4();
    const name = path.basename(srcPath);
    const extension = path.extname(srcPath);
    const shortPath = path.join('music', id + extension);

    musicFiles.push({ id, name, path: shortPath, isPending: true });

    const destPath = path.join(RESOURCES_PATH, shortPath);
    fs.copyFile(srcPath, destPath);
  }

  event.reply('copy-music', [musicFiles]);
});

ipcMain.on('remove-music', async (event, arg) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const shortPath = arg[0];
  const destPath = path.join(RESOURCES_PATH, shortPath);

  fs.removeSync(destPath);

  event.reply('remove-music', []);
});

ipcMain.on('export-data', async (event, arg) => {
  const data = arg[0];

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const musicFolder = path.join(RESOURCES_PATH, 'music');
  const imagesFolder = path.join(RESOURCES_PATH, 'question_images');

  const destFolder = os.homedir() + '/Desktop/GuessTheMelody DATA';
  const destFile = os.homedir() + '/Desktop/GuessTheMelody DATA/data.json';

  fs.mkdir(destFolder, (err) => {
    if (err) {
      event.reply('export-data', [err.message]);
    } else {
      fs.copy(imagesFolder, destFolder + '/question_images').catch((err) =>
        event.reply('export-data', [err.message])
      );

      fs.copy(musicFolder, destFolder + '/music')
        .then(() => {
          fs.writeFile(destFile, data, (err) => {
            if (err) {
              event.reply('export-data', [err.message]);
            } else {
              event.reply('export-data', [
                'Экспортировано на рабочий стол.',
                data,
              ]);
            }
          });
        })
        .catch((err) => event.reply('export-data', [err.message]));
    }
  });
});

ipcMain.on('import-data', async (event, arg) => {
  const jsonPath = arg[0];
  const musicFolder = jsonPath.replace('data.json', 'music');
  const imagesFolder = jsonPath.replace('data.json', 'question_images');

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const musicDestFolder = path.join(RESOURCES_PATH, 'music');
  const imagesDestFolder = path.join(RESOURCES_PATH, 'question_images');

  fs.emptyDir(imagesDestFolder)
    .then(() => {
      fs.copy(imagesFolder, imagesDestFolder).then(() => {
        fs.emptyDir(musicDestFolder)
          .then(() => {
            fs.copy(musicFolder, musicDestFolder);
          })
          .catch((err) => event.reply('import-data', [err.message, null]));

        fs.readFile(jsonPath, { encoding: 'utf8' })
          .then((file) => {
            const data = JSON.parse(file);
            event.reply('import-data', ['Импортировано', data]);
          })
          .catch((err) => {
            event.reply('import-data', [err.message, null]);
          });
      });
    })
    .catch((err) => event.reply('import-data', [err.message, null]));
});

ipcMain.on('clear-music', async (event) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const destFolder = path.join(RESOURCES_PATH, 'music');

  fs.emptyDir(destFolder);

  event.reply('clear-music', []);
});

ipcMain.on('copy-image', async (event, arg) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const imageSrc = arg[0];

  const id = uuidv4();
  const extension = path.extname(imageSrc);
  const shortPath = path.join('question_images', id + extension);

  const destPath = path.join(RESOURCES_PATH, shortPath);
  fs.copyFile(imageSrc, destPath);

  event.reply('copy-image', [shortPath]);
});

ipcMain.on('remove-image', async (event, arg) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const shortPath = arg[0];
  const destPath = path.join(RESOURCES_PATH, shortPath);

  fs.removeSync(destPath);

  event.reply('remove-image', []);
});

ipcMain.on('clear-images', async (event) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const destFolder = path.join(RESOURCES_PATH, 'question_images');

  fs.emptyDir(destFolder);

  event.reply('clear-images', []);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 768,
    autoHideMenuBar: true,
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
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

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //new AppUpdater();
};

/**
 * Add event listeners...
 */

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
