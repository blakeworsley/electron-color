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
          .catch((err) => console.log(err));
      }
    });
};

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
const defaultColorPalette = [{"r":"255","g":"0","b":"69","a":"1"},{"r":"255","g":"0","b":"154","a":"1"},{"r":"255","g":"0","b":"255","a":"1"},{"r":"143","g":"0","b":"255","a":"1"},{"r":"68","g":"0","b":"255","a":"1"},{"r":"0","g":"0","b":"255","a":"1"},{"r":"0","g":"79","b":"255","a":"1"},{"r":"0","g":"160","b":"255","a":"1"},{"r":"0","g":"255","b":"255","a":"1"},{"r":"0","g":"255","b":"163","a":"1"},{"r":"0","g":"255","b":"86","a":"1"},{"r":"0","g":"255","b":"0","a":"1"},{"r":"89","g":"255","b":"0","a":"1"},{"r":"170","g":"255","b":"0","a":"1"},{"r":"255","g":"255","b":"0","a":"1"},{"r":"255","g":"157","b":"0","a":"1"},{"r":"255","g":"79","b":"0","a":"1"},{"r":"255","g":"0","b":"0","a":"1"},{"r":"167","g":"0","b":"0","a":"1"},{"r":"71","g":"0","b":"0","a":"1"}]

const defaultData = {"current":{"r":"255","g":"0","b":"69","a":"1"},"saved": defaultColorPalette};

const template = [
  {
    role: 'window',
    submenu: [
      {
        label: 'Dev Tools',
        accelerator: 'Cmd+I',
        role: 'toggledevtools'
      },
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

