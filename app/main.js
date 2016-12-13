const { app, Menu, BrowserWindow } = require('electron');
const storage = require('electron-storage');

let mainWindow = null;

app.on('ready', () => {
  doesStorageExist();
  mainWindow = new BrowserWindow({
    width: 3000,
    height: 3000,
    fullscreen: false,
    frame: false,
    transparent: true,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  Menu.setApplicationMenu(menu);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
});

const doesStorageExist = () => {
  storage.isPathExists('saved-colors.json')
    .then(itDoes => {
      if (!itDoes) {
        storage.set('saved-colors', defaultData)
          .then(() => console.log('The file was successfully written to the storage'))
          .catch((err) => console.log(err));
      }
    });
};

// const onRefocus() = exports.onRefocus = () => {
//   return mainWindow.setIgnoreMouseEvents(false)
// }

// const clickThroughWindow = exports.clickThroughWindow = (mouseInApp) => {
//   return mainWindow.setIgnoreMouseEvents(mouseInApp)
// }

const retrieveDataFromStorage = exports.retrieveDataFromStorage = () => {
  storage.get('saved-colors')
    .then(data => {
      mainWindow.webContents.send('retrieved-colors', data);
    }).catch(err => {
      console.log(err);
    });
};

const persistCurrentColor = exports.persistCurrentColor = (newCurrent) => {
  storage.get('saved-colors')
    .then(({ saved }) => {
      let updatedStorage = { current: newCurrent, saved };
      storage.set('saved-colors', updatedStorage)
        .catch((err) => console.log(err));
    })
    .catch(err => {
      console.log(err);
    });
};

const saveCurrentColor = exports.saveCurrentColor = (color) => {
  storage.get('saved-colors')
    .then((data) => {
      data.saved.unshift(color);
      let updatedColorArray = { current: data.current, saved: data.saved };
      storage.set('saved-colors', updatedColorArray)
        .then(() => retrieveDataFromStorage())
        .catch((err) => console.log(err));
    })
    .catch(err => console.log(err));
};

//data model//
const defaultData = { "current": {"r": 0, "g": 0, "b": 0, "a": 1 }, "saved": [] };

const template = [
  {
    role: 'window',
    submenu: [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      },
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
console.log(menu);