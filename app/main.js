const { app, BrowserWindow } = require('electron');
const storage = require('electron-storage');

let mainWindow = null;

app.on('ready', () => {

  doesStorageExist();

  mainWindow = new BrowserWindow({
    width: 3000,
    height: 3000,
    frame: false,
    transparent: true,
    // width: 300,
    // height: 500,
    // maxWidth: 800,
    // maxHeight: 600
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

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

const retrieveDataFromStorage = exports.retrieveDataFromStorage = () => {
  storage.get('saved-colors')
    .then(data => {
      mainWindow.webContents.send('retrieved-colors', data);
    })
    .catch(err => {
      console.log(err);
    });
};

const persistCurrentColor = exports.persistCurrentColor = (newCurrent) => {
  storage.get('saved-colors')
    .then(({ saved }) => {
      let updatedStorage = { current: newCurrent, saved };
      storage.set('saved-colors', updatedStorage)
        .then(() => console.log('Nailed it!'))
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
        .then(() => {console.log('Saved to array!');
        })
        .catch((err) => console.log(err));
    })
    .catch(err => console.log(err));
};



//data model//
const defaultData = { current: {r: 0, g: 0, b: 0, a: 1 }, saved: [] };
